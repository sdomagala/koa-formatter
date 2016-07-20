// @flow

type KoaFormatter$Options = {
  formatter?: (ctx: Koa$Context, err: any) => any;
};

declare module 'koa-formatter' {
  declare function exports(options?: KoaFormatter$Options): (ctx: Koa$Context, next: Function) => Promise;
}