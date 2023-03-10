# В Alpine версий выше 3.8 возникает ошибка, связанная с ssl, возможно поправят в новом релизе
ARG ALPINE_VERSION=3.8.4

###########################
# Building pagespeed psol #
###########################
FROM alpine:${ALPINE_VERSION} as pagespeed
#ARG MOD_PAGESPEED_TAG=1.13.35.2
# Пришлось сделать fork проекта и поправить битые пути для некоторых git submodules в релизе 1.13.35.2, пока не выйдет новая версия
ARG MOD_PAGESPEED_TAG=workable

RUN apk update && apk add --no-cache \
        apache2-dev \
        apr-dev \
        apr-util-dev \
        build-base \
        curl \
        gettext-dev \
        git \
        gperf \
        icu-dev \
        libjpeg-turbo-dev \
        libpng-dev \
        libressl-dev \
        pcre-dev \
        py-setuptools \
        zlib-dev

WORKDIR /usr/src
RUN git clone -b ${MOD_PAGESPEED_TAG} \
              --recurse-submodules \
              --depth=1 \
              -c advice.detachedHead=false \
              -j`nproc` \
              https://github.com/Shantira/incubator-pagespeed-mod.git \
              incubator-pagespeed-mod-${MOD_PAGESPEED_TAG}

WORKDIR /usr/src/incubator-pagespeed-mod-${MOD_PAGESPEED_TAG}
COPY mod_pagespeed_patches/*.patch ./
RUN for i in *.patch; do printf "\r\nApplying patch ${i%%.*}\r\n"; patch -p1 < $i || exit 1; done

WORKDIR /usr/src/incubator-pagespeed-mod-${MOD_PAGESPEED_TAG}/tools/gyp
RUN ./setup.py install

WORKDIR /usr/src/incubator-pagespeed-mod-${MOD_PAGESPEED_TAG}

RUN build/gyp_chromium --depth=. -D use_system_libs=1 \
    && cd /usr/src/incubator-pagespeed-mod-${MOD_PAGESPEED_TAG}/pagespeed/automatic \
    && make psol BUILDTYPE=Release \
            CFLAGS+="-I/usr/include/apr-1" \
            CXXFLAGS+="-I/usr/include/apr-1 -DUCHAR_TYPE=uint16_t" \
            -j`nproc`

RUN mkdir -p /usr/src/ngxpagespeed/psol/lib/Release/linux/x64 \
    && mkdir -p /usr/src/ngxpagespeed/psol/include/out/Release \
    && cp -R out/Release/obj /usr/src/ngxpagespeed/psol/include/out/Release/ \
    && cp -R pagespeed/automatic/pagespeed_automatic.a /usr/src/ngxpagespeed/psol/lib/Release/linux/x64/ \
    && cp -R net \
          pagespeed \
          testing \
          third_party \
          url \
          /usr/src/ngxpagespeed/psol/include/

################################
# Build Nginx with all modules #
################################
FROM alpine:${ALPINE_VERSION} AS nginx

ARG NGINX_VERSION=1.16.1
ARG VTS_VERSION=0.1.18
ARG SECURITY_HEADERS_VERSION=0.0.7
ARG NGX_PAGESPEED_TAG=v1.13.35.2

ARG NGINX_BUILD_CONFIG="\
        --prefix=/etc/nginx \
        --sbin-path=/usr/sbin/nginx \
        --modules-path=/usr/lib/nginx/modules \
        --conf-path=/etc/nginx/nginx.conf \
        --error-log-path=/var/log/nginx/error.log \
        --http-log-path=/var/log/nginx/access.log \
        --pid-path=/var/run/nginx.pid \
        --lock-path=/var/run/nginx.lock \
        --http-client-body-temp-path=/var/cache/nginx/client_temp \
        --http-proxy-temp-path=/var/cache/nginx/proxy_temp \
        --http-fastcgi-temp-path=/var/cache/nginx/fastcgi_temp \
        --http-uwsgi-temp-path=/var/cache/nginx/uwsgi_temp \
        --http-scgi-temp-path=/var/cache/nginx/scgi_temp \
        --user=nginx \
        --group=nginx \
        --with-http_ssl_module \
        --with-http_realip_module \
        --with-http_gzip_static_module \
        --with-http_secure_link_module \
        --with-http_stub_status_module \
        --with-http_image_filter_module=dynamic \
        --with-http_geoip_module=dynamic \
        --with-threads \
        --with-stream \
        --with-stream_ssl_module \
        --with-stream_ssl_preread_module \
        --with-stream_realip_module \
        --with-stream_geoip_module=dynamic \
        --with-compat \
        --with-file-aio \
        --with-http_v2_module \
        --add-module=/usr/src/nginx-module-vts-${VTS_VERSION} \
        --add-module=/usr/src/ngx_security_headers-${SECURITY_HEADERS_VERSION} \
        --add-module=/usr/src/incubator-pagespeed-ngx-${NGX_PAGESPEED_TAG}-stable \
    "

RUN apk update && apk add --no-cache \
        apr-dev \
        apr-util-dev \
        build-base \
        ca-certificates \
        gd-dev \
        geoip-dev \
        git \
        gnupg \
        icu-dev \
        libjpeg-turbo-dev \
        libpng-dev \
        libxslt-dev \
        linux-headers \
        libressl-dev \
        pcre-dev \
        tar \
        curl \
        zlib-dev

WORKDIR /usr/src
RUN git clone -b ${NGX_PAGESPEED_TAG}-stable \
              --recurse-submodules \
              --shallow-submodules \
              --depth=1 \
              -c advice.detachedHead=false \
              -j`nproc` \
              https://github.com/apache/incubator-pagespeed-ngx.git \
              incubator-pagespeed-ngx-${NGX_PAGESPEED_TAG}-stable

COPY --from=pagespeed /usr/src/ngxpagespeed /usr/src/incubator-pagespeed-ngx-${NGX_PAGESPEED_TAG}-stable/

RUN curl -fSL http://nginx.org/download/nginx-${NGINX_VERSION}.tar.gz -o nginx.tar.gz \
    && curl -fSL https://github.com/vozlt/nginx-module-vts/archive/v${VTS_VERSION}.tar.gz -o nginx-modules-vts.tar.gz \
    && curl -fSL https://github.com/GetPageSpeed/ngx_security_headers/archive/${SECURITY_HEADERS_VERSION}.tar.gz -o nginx-modules-security-headers.tar.gz \
    && tar -zxC /usr/src -f nginx.tar.gz \
    && tar -zxC /usr/src -f nginx-modules-vts.tar.gz \
    && tar -zxC /usr/src -f nginx-modules-security-headers.tar.gz

WORKDIR /usr/src/nginx-${NGINX_VERSION}
RUN ./configure ${NGINX_BUILD_CONFIG} \
    --with-ld-opt="-Wl,-z,relro,--start-group -lapr-1 -laprutil-1 -licudata -licuuc -lpng -lturbojpeg -ljpeg" \
    && make install -j`nproc`

RUN rm -rf /etc/nginx/html/ \
    && mkdir /etc/nginx/conf.d/ \
    && mkdir -p /usr/share/nginx/html/ \
    && install -m644 html/index.html /usr/share/nginx/html/ \
    && install -m644 html/50x.html /usr/share/nginx/html/ \
    && ln -s ../../usr/lib/nginx/modules /etc/nginx/modules \
    && strip /usr/sbin/nginx* \
             /usr/lib/nginx/modules/*.so

COPY ./config/nginx.conf /etc/nginx/nginx.conf
COPY ./config/default.conf /etc/nginx/conf.d/default.conf

############################################
# Building final image with minimal layers #
############################################
FROM alpine:$ALPINE_VERSION

ARG VTS_EXPORTER_VERSION=0.10.3

COPY --from=pagespeed /usr/bin/envsubst /usr/local/bin
COPY --from=nginx /usr/sbin/nginx /usr/sbin/nginx
COPY --from=nginx /usr/lib/nginx/modules/ /usr/lib/nginx/modules/
COPY --from=nginx /etc/nginx /etc/nginx
COPY --from=nginx /usr/share/nginx/html/ /usr/share/nginx/html/

RUN apk update --no-cache && \
    scanelf --needed --nobanner --format '%n#p' /usr/sbin/nginx /usr/lib/nginx/modules/*.so /usr/local/bin/envsubst \
            | tr ',' '\n' \
            | awk 'system("[ -e /usr/local/lib/" $1 " ]") == 0 { next } { print "so:" $1 }' \
            | xargs apk add --no-cache \
    && apk add certbot curl tzdata logrotate nano sudo \
    && cp /usr/share/zoneinfo/Europe/Moscow /etc/localtime \
    && echo "Europe/Moscow" > /etc/timezone \
    && apk del tzdata \
    && rm -f /var/cache/apk/* \
    # Install nginx metrics exporter
    && curl -fSL https://github.com/hnlq715/nginx-vts-exporter/releases/download/v${VTS_EXPORTER_VERSION}/nginx-vts-exporter-${VTS_EXPORTER_VERSION}.linux-amd64.tar.gz -o /tmp/nginx-vts-exporter.tar.gz \
    && tar -zxf /tmp/nginx-vts-exporter.tar.gz -C /tmp && rm -f /tmp/nginx-vts-exporter.tar.gz \
    && mv /tmp/nginx-vts-exporter*/nginx-vts-exporter /bin/nginx-vts-exporter \
    && chown root:root /bin/nginx-vts-exporter \
    && rm -rf /tmp/nginx-vts-exporter*

RUN addgroup -S nginx \
    && adduser -D -S -h /var/cache/nginx -s /sbin/nologin -G nginx nginx \
    && install -g nginx -o nginx -d /var/cache/ngx_pagespeed \
    && mkdir -p /var/log/nginx \
    && ln -sf /dev/stdout /var/log/nginx/access.log \
    && ln -sf /dev/stderr /var/log/nginx/error.log \
    && mkdir /cron /letsencrypt

COPY ./logrotate/nginx /etc/logrotate.d/nginx
COPY ./cron/crontab /cron/crontab
RUN crontab /cron/crontab

COPY ./entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT /entrypoint.sh

WORKDIR /etc/nginx

EXPOSE 80 443 19105
STOPSIGNAL SIGTERM