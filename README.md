
# Semux Web Wallet

This is the source code of Semux Web Wallet, which allows you to interact with Semux Network without installation.

## Building from source

Pre-requisite:
- Node.js 10 or above
- npm

Build:
```
git clone https://github.com/semuxproject/semux-web-wallet.git
cd semux-web-wallet
make clean build
```

Run
```
sudo npm install http-server -g
http-server -p 8080 build
```

## Trying it out

You can also access Semux Web Wallet from the following sites:
- https://wallet.semux.info

## License

This package is licensed under [ISC](./LICENSE)
