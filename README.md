
# Semux Web Wallet

The Semux Web Mainnet client is here: https://wallet.semux.info 

It is using public API server from here: https://api.semux.info (endpoint hardcoded in `src/main/lib/api.ts`)

---

![semux-light](https://github.com/semuxproject/semux-light/raw/assets/semux-light-testnet.png)

## Running locally:


- git clone and build Semux Light
    ```
    $ git clone https://github.com/semuxproject/semux-light.git
    $ cd semux-light
    $ make clean build
    ```

- open in browser `build/index.html` file
- if you want to use your own API server, modify endpoint in `src/main/lib/api.ts` and re-build the project
