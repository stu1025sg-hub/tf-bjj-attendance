/**
 * ==========================================================
 * TF FITNESS BJJ
 * PWA SERVICE WORKER
 *
 * Version 1.3
 *
 * The PWA shell is cached.
 * Live attendance still requires internet.
 * ==========================================================
 */


const CACHE_NAME =
  "tf-bjj-pwa-v1.3";


const SHELL_FILES = [

  "./",

  "./index.html",

  "./manifest.json",

  "./offline.html",

  "./icon-192.png",

  "./icon-512.png"

];



self.addEventListener(
  "install",
  function(event) {


    event.waitUntil(

      caches
        .open(
          CACHE_NAME
        )
        .then(
          function(cache) {


            return cache.addAll(
              SHELL_FILES
            );


          }
        )

    );


    self.skipWaiting();

  }
);



self.addEventListener(
  "activate",
  function(event) {


    event.waitUntil(

      caches
        .keys()
        .then(
          function(keys) {


            return Promise.all(

              keys.map(
                function(key) {


                  if (
                    key !==
                    CACHE_NAME
                  ) {


                    return caches.delete(
                      key
                    );


                  }


                }
              )

            );


          }
        )

    );


    self.clients.claim();

  }
);



self.addEventListener(
  "fetch",
  function(event) {


    const request =
      event.request;


    const requestURL =
      new URL(
        request.url
      );


    /**
     * Leave external requests alone.
     *
     * This includes:
     * - Google Apps Script
     * - QR image service
     */

    if (
      requestURL.origin !==
      self.location.origin
    ) {

      return;

    }


    /**
     * Navigation:
     * network first, cached shell fallback.
     */

    if (
      request.mode ===
      "navigate"
    ) {


      event.respondWith(

        fetch(
          request
        )

          .then(
            function(response) {


              const copy =
                response.clone();


              caches
                .open(
                  CACHE_NAME
                )
                .then(
                  function(cache) {


                    cache.put(
                      "./index.html",
                      copy
                    );


                  }
                );


              return response;


            }
          )

          .catch(
            function() {


              return caches.match(
                "./index.html"
              );


            }
          )

      );


      return;

    }


    /**
     * Shell files:
     * cache first.
     */

    event.respondWith(

      caches
        .match(
          request
        )
        .then(
          function(cachedResponse) {


            if (
              cachedResponse
            ) {


              return cachedResponse;


            }


            return fetch(
              request
            );


          }
        )

    );

  }
);
