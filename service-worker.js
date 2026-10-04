/**
 * TF FITNESS BJJ
 * PWA SERVICE WORKER
 *
 * Version 1.2
 *
 * Important:
 * This caches the PWA shell only.
 * Attendance/database operations still require internet.
 */


const CACHE_NAME =
  "tf-bjj-pwa-v1.2";


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
                    key !== CACHE_NAME
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
     * Only handle files belonging
     * to the GitHub PWA shell.
     *
     * The embedded Apps Script application
     * remains a live network connection.
     */

    if (
      requestURL.origin !==
      self.location.origin
    ) {

      return;

    }


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
                      request,
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
