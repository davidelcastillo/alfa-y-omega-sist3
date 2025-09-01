
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Rubro
 * 
 */
export type Rubro = $Result.DefaultSelection<Prisma.$RubroPayload>
/**
 * Model Unidad
 * 
 */
export type Unidad = $Result.DefaultSelection<Prisma.$UnidadPayload>
/**
 * Model Marca
 * 
 */
export type Marca = $Result.DefaultSelection<Prisma.$MarcaPayload>
/**
 * Model Producto
 * 
 */
export type Producto = $Result.DefaultSelection<Prisma.$ProductoPayload>
/**
 * Model Deposito
 * 
 */
export type Deposito = $Result.DefaultSelection<Prisma.$DepositoPayload>
/**
 * Model StockPorDeposito
 * 
 */
export type StockPorDeposito = $Result.DefaultSelection<Prisma.$StockPorDepositoPayload>
/**
 * Model MovimientoStock
 * 
 */
export type MovimientoStock = $Result.DefaultSelection<Prisma.$MovimientoStockPayload>
/**
 * Model DetalleMovimiento
 * 
 */
export type DetalleMovimiento = $Result.DefaultSelection<Prisma.$DetalleMovimientoPayload>
/**
 * Model TipoComprobante
 * 
 */
export type TipoComprobante = $Result.DefaultSelection<Prisma.$TipoComprobantePayload>
/**
 * Model TipoMovimiento
 * 
 */
export type TipoMovimiento = $Result.DefaultSelection<Prisma.$TipoMovimientoPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Rubros
 * const rubros = await prisma.rubro.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Rubros
   * const rubros = await prisma.rubro.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.rubro`: Exposes CRUD operations for the **Rubro** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Rubros
    * const rubros = await prisma.rubro.findMany()
    * ```
    */
  get rubro(): Prisma.RubroDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.unidad`: Exposes CRUD operations for the **Unidad** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Unidads
    * const unidads = await prisma.unidad.findMany()
    * ```
    */
  get unidad(): Prisma.UnidadDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.marca`: Exposes CRUD operations for the **Marca** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Marcas
    * const marcas = await prisma.marca.findMany()
    * ```
    */
  get marca(): Prisma.MarcaDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.producto`: Exposes CRUD operations for the **Producto** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Productos
    * const productos = await prisma.producto.findMany()
    * ```
    */
  get producto(): Prisma.ProductoDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.deposito`: Exposes CRUD operations for the **Deposito** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Depositos
    * const depositos = await prisma.deposito.findMany()
    * ```
    */
  get deposito(): Prisma.DepositoDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.stockPorDeposito`: Exposes CRUD operations for the **StockPorDeposito** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more StockPorDepositos
    * const stockPorDepositos = await prisma.stockPorDeposito.findMany()
    * ```
    */
  get stockPorDeposito(): Prisma.StockPorDepositoDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.movimientoStock`: Exposes CRUD operations for the **MovimientoStock** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MovimientoStocks
    * const movimientoStocks = await prisma.movimientoStock.findMany()
    * ```
    */
  get movimientoStock(): Prisma.MovimientoStockDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.detalleMovimiento`: Exposes CRUD operations for the **DetalleMovimiento** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DetalleMovimientos
    * const detalleMovimientos = await prisma.detalleMovimiento.findMany()
    * ```
    */
  get detalleMovimiento(): Prisma.DetalleMovimientoDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.tipoComprobante`: Exposes CRUD operations for the **TipoComprobante** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TipoComprobantes
    * const tipoComprobantes = await prisma.tipoComprobante.findMany()
    * ```
    */
  get tipoComprobante(): Prisma.TipoComprobanteDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.tipoMovimiento`: Exposes CRUD operations for the **TipoMovimiento** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TipoMovimientos
    * const tipoMovimientos = await prisma.tipoMovimiento.findMany()
    * ```
    */
  get tipoMovimiento(): Prisma.TipoMovimientoDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.15.0
   * Query Engine version: 85179d7826409ee107a6ba334b5e305ae3fba9fb
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Rubro: 'Rubro',
    Unidad: 'Unidad',
    Marca: 'Marca',
    Producto: 'Producto',
    Deposito: 'Deposito',
    StockPorDeposito: 'StockPorDeposito',
    MovimientoStock: 'MovimientoStock',
    DetalleMovimiento: 'DetalleMovimiento',
    TipoComprobante: 'TipoComprobante',
    TipoMovimiento: 'TipoMovimiento'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "rubro" | "unidad" | "marca" | "producto" | "deposito" | "stockPorDeposito" | "movimientoStock" | "detalleMovimiento" | "tipoComprobante" | "tipoMovimiento"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Rubro: {
        payload: Prisma.$RubroPayload<ExtArgs>
        fields: Prisma.RubroFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RubroFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RubroPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RubroFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RubroPayload>
          }
          findFirst: {
            args: Prisma.RubroFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RubroPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RubroFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RubroPayload>
          }
          findMany: {
            args: Prisma.RubroFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RubroPayload>[]
          }
          create: {
            args: Prisma.RubroCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RubroPayload>
          }
          createMany: {
            args: Prisma.RubroCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RubroCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RubroPayload>[]
          }
          delete: {
            args: Prisma.RubroDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RubroPayload>
          }
          update: {
            args: Prisma.RubroUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RubroPayload>
          }
          deleteMany: {
            args: Prisma.RubroDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RubroUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RubroUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RubroPayload>[]
          }
          upsert: {
            args: Prisma.RubroUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RubroPayload>
          }
          aggregate: {
            args: Prisma.RubroAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRubro>
          }
          groupBy: {
            args: Prisma.RubroGroupByArgs<ExtArgs>
            result: $Utils.Optional<RubroGroupByOutputType>[]
          }
          count: {
            args: Prisma.RubroCountArgs<ExtArgs>
            result: $Utils.Optional<RubroCountAggregateOutputType> | number
          }
        }
      }
      Unidad: {
        payload: Prisma.$UnidadPayload<ExtArgs>
        fields: Prisma.UnidadFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UnidadFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UnidadPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UnidadFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UnidadPayload>
          }
          findFirst: {
            args: Prisma.UnidadFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UnidadPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UnidadFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UnidadPayload>
          }
          findMany: {
            args: Prisma.UnidadFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UnidadPayload>[]
          }
          create: {
            args: Prisma.UnidadCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UnidadPayload>
          }
          createMany: {
            args: Prisma.UnidadCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UnidadCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UnidadPayload>[]
          }
          delete: {
            args: Prisma.UnidadDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UnidadPayload>
          }
          update: {
            args: Prisma.UnidadUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UnidadPayload>
          }
          deleteMany: {
            args: Prisma.UnidadDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UnidadUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UnidadUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UnidadPayload>[]
          }
          upsert: {
            args: Prisma.UnidadUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UnidadPayload>
          }
          aggregate: {
            args: Prisma.UnidadAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUnidad>
          }
          groupBy: {
            args: Prisma.UnidadGroupByArgs<ExtArgs>
            result: $Utils.Optional<UnidadGroupByOutputType>[]
          }
          count: {
            args: Prisma.UnidadCountArgs<ExtArgs>
            result: $Utils.Optional<UnidadCountAggregateOutputType> | number
          }
        }
      }
      Marca: {
        payload: Prisma.$MarcaPayload<ExtArgs>
        fields: Prisma.MarcaFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MarcaFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarcaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MarcaFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarcaPayload>
          }
          findFirst: {
            args: Prisma.MarcaFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarcaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MarcaFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarcaPayload>
          }
          findMany: {
            args: Prisma.MarcaFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarcaPayload>[]
          }
          create: {
            args: Prisma.MarcaCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarcaPayload>
          }
          createMany: {
            args: Prisma.MarcaCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MarcaCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarcaPayload>[]
          }
          delete: {
            args: Prisma.MarcaDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarcaPayload>
          }
          update: {
            args: Prisma.MarcaUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarcaPayload>
          }
          deleteMany: {
            args: Prisma.MarcaDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MarcaUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MarcaUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarcaPayload>[]
          }
          upsert: {
            args: Prisma.MarcaUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarcaPayload>
          }
          aggregate: {
            args: Prisma.MarcaAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMarca>
          }
          groupBy: {
            args: Prisma.MarcaGroupByArgs<ExtArgs>
            result: $Utils.Optional<MarcaGroupByOutputType>[]
          }
          count: {
            args: Prisma.MarcaCountArgs<ExtArgs>
            result: $Utils.Optional<MarcaCountAggregateOutputType> | number
          }
        }
      }
      Producto: {
        payload: Prisma.$ProductoPayload<ExtArgs>
        fields: Prisma.ProductoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProductoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProductoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductoPayload>
          }
          findFirst: {
            args: Prisma.ProductoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProductoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductoPayload>
          }
          findMany: {
            args: Prisma.ProductoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductoPayload>[]
          }
          create: {
            args: Prisma.ProductoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductoPayload>
          }
          createMany: {
            args: Prisma.ProductoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProductoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductoPayload>[]
          }
          delete: {
            args: Prisma.ProductoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductoPayload>
          }
          update: {
            args: Prisma.ProductoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductoPayload>
          }
          deleteMany: {
            args: Prisma.ProductoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProductoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProductoUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductoPayload>[]
          }
          upsert: {
            args: Prisma.ProductoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductoPayload>
          }
          aggregate: {
            args: Prisma.ProductoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProducto>
          }
          groupBy: {
            args: Prisma.ProductoGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProductoGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProductoCountArgs<ExtArgs>
            result: $Utils.Optional<ProductoCountAggregateOutputType> | number
          }
        }
      }
      Deposito: {
        payload: Prisma.$DepositoPayload<ExtArgs>
        fields: Prisma.DepositoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DepositoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepositoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DepositoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepositoPayload>
          }
          findFirst: {
            args: Prisma.DepositoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepositoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DepositoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepositoPayload>
          }
          findMany: {
            args: Prisma.DepositoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepositoPayload>[]
          }
          create: {
            args: Prisma.DepositoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepositoPayload>
          }
          createMany: {
            args: Prisma.DepositoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DepositoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepositoPayload>[]
          }
          delete: {
            args: Prisma.DepositoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepositoPayload>
          }
          update: {
            args: Prisma.DepositoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepositoPayload>
          }
          deleteMany: {
            args: Prisma.DepositoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DepositoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DepositoUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepositoPayload>[]
          }
          upsert: {
            args: Prisma.DepositoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepositoPayload>
          }
          aggregate: {
            args: Prisma.DepositoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDeposito>
          }
          groupBy: {
            args: Prisma.DepositoGroupByArgs<ExtArgs>
            result: $Utils.Optional<DepositoGroupByOutputType>[]
          }
          count: {
            args: Prisma.DepositoCountArgs<ExtArgs>
            result: $Utils.Optional<DepositoCountAggregateOutputType> | number
          }
        }
      }
      StockPorDeposito: {
        payload: Prisma.$StockPorDepositoPayload<ExtArgs>
        fields: Prisma.StockPorDepositoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.StockPorDepositoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockPorDepositoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.StockPorDepositoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockPorDepositoPayload>
          }
          findFirst: {
            args: Prisma.StockPorDepositoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockPorDepositoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.StockPorDepositoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockPorDepositoPayload>
          }
          findMany: {
            args: Prisma.StockPorDepositoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockPorDepositoPayload>[]
          }
          create: {
            args: Prisma.StockPorDepositoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockPorDepositoPayload>
          }
          createMany: {
            args: Prisma.StockPorDepositoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.StockPorDepositoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockPorDepositoPayload>[]
          }
          delete: {
            args: Prisma.StockPorDepositoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockPorDepositoPayload>
          }
          update: {
            args: Prisma.StockPorDepositoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockPorDepositoPayload>
          }
          deleteMany: {
            args: Prisma.StockPorDepositoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.StockPorDepositoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.StockPorDepositoUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockPorDepositoPayload>[]
          }
          upsert: {
            args: Prisma.StockPorDepositoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StockPorDepositoPayload>
          }
          aggregate: {
            args: Prisma.StockPorDepositoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateStockPorDeposito>
          }
          groupBy: {
            args: Prisma.StockPorDepositoGroupByArgs<ExtArgs>
            result: $Utils.Optional<StockPorDepositoGroupByOutputType>[]
          }
          count: {
            args: Prisma.StockPorDepositoCountArgs<ExtArgs>
            result: $Utils.Optional<StockPorDepositoCountAggregateOutputType> | number
          }
        }
      }
      MovimientoStock: {
        payload: Prisma.$MovimientoStockPayload<ExtArgs>
        fields: Prisma.MovimientoStockFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MovimientoStockFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MovimientoStockPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MovimientoStockFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MovimientoStockPayload>
          }
          findFirst: {
            args: Prisma.MovimientoStockFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MovimientoStockPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MovimientoStockFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MovimientoStockPayload>
          }
          findMany: {
            args: Prisma.MovimientoStockFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MovimientoStockPayload>[]
          }
          create: {
            args: Prisma.MovimientoStockCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MovimientoStockPayload>
          }
          createMany: {
            args: Prisma.MovimientoStockCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MovimientoStockCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MovimientoStockPayload>[]
          }
          delete: {
            args: Prisma.MovimientoStockDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MovimientoStockPayload>
          }
          update: {
            args: Prisma.MovimientoStockUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MovimientoStockPayload>
          }
          deleteMany: {
            args: Prisma.MovimientoStockDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MovimientoStockUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MovimientoStockUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MovimientoStockPayload>[]
          }
          upsert: {
            args: Prisma.MovimientoStockUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MovimientoStockPayload>
          }
          aggregate: {
            args: Prisma.MovimientoStockAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMovimientoStock>
          }
          groupBy: {
            args: Prisma.MovimientoStockGroupByArgs<ExtArgs>
            result: $Utils.Optional<MovimientoStockGroupByOutputType>[]
          }
          count: {
            args: Prisma.MovimientoStockCountArgs<ExtArgs>
            result: $Utils.Optional<MovimientoStockCountAggregateOutputType> | number
          }
        }
      }
      DetalleMovimiento: {
        payload: Prisma.$DetalleMovimientoPayload<ExtArgs>
        fields: Prisma.DetalleMovimientoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DetalleMovimientoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DetalleMovimientoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DetalleMovimientoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DetalleMovimientoPayload>
          }
          findFirst: {
            args: Prisma.DetalleMovimientoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DetalleMovimientoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DetalleMovimientoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DetalleMovimientoPayload>
          }
          findMany: {
            args: Prisma.DetalleMovimientoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DetalleMovimientoPayload>[]
          }
          create: {
            args: Prisma.DetalleMovimientoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DetalleMovimientoPayload>
          }
          createMany: {
            args: Prisma.DetalleMovimientoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DetalleMovimientoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DetalleMovimientoPayload>[]
          }
          delete: {
            args: Prisma.DetalleMovimientoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DetalleMovimientoPayload>
          }
          update: {
            args: Prisma.DetalleMovimientoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DetalleMovimientoPayload>
          }
          deleteMany: {
            args: Prisma.DetalleMovimientoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DetalleMovimientoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DetalleMovimientoUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DetalleMovimientoPayload>[]
          }
          upsert: {
            args: Prisma.DetalleMovimientoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DetalleMovimientoPayload>
          }
          aggregate: {
            args: Prisma.DetalleMovimientoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDetalleMovimiento>
          }
          groupBy: {
            args: Prisma.DetalleMovimientoGroupByArgs<ExtArgs>
            result: $Utils.Optional<DetalleMovimientoGroupByOutputType>[]
          }
          count: {
            args: Prisma.DetalleMovimientoCountArgs<ExtArgs>
            result: $Utils.Optional<DetalleMovimientoCountAggregateOutputType> | number
          }
        }
      }
      TipoComprobante: {
        payload: Prisma.$TipoComprobantePayload<ExtArgs>
        fields: Prisma.TipoComprobanteFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TipoComprobanteFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TipoComprobantePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TipoComprobanteFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TipoComprobantePayload>
          }
          findFirst: {
            args: Prisma.TipoComprobanteFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TipoComprobantePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TipoComprobanteFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TipoComprobantePayload>
          }
          findMany: {
            args: Prisma.TipoComprobanteFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TipoComprobantePayload>[]
          }
          create: {
            args: Prisma.TipoComprobanteCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TipoComprobantePayload>
          }
          createMany: {
            args: Prisma.TipoComprobanteCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TipoComprobanteCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TipoComprobantePayload>[]
          }
          delete: {
            args: Prisma.TipoComprobanteDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TipoComprobantePayload>
          }
          update: {
            args: Prisma.TipoComprobanteUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TipoComprobantePayload>
          }
          deleteMany: {
            args: Prisma.TipoComprobanteDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TipoComprobanteUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TipoComprobanteUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TipoComprobantePayload>[]
          }
          upsert: {
            args: Prisma.TipoComprobanteUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TipoComprobantePayload>
          }
          aggregate: {
            args: Prisma.TipoComprobanteAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTipoComprobante>
          }
          groupBy: {
            args: Prisma.TipoComprobanteGroupByArgs<ExtArgs>
            result: $Utils.Optional<TipoComprobanteGroupByOutputType>[]
          }
          count: {
            args: Prisma.TipoComprobanteCountArgs<ExtArgs>
            result: $Utils.Optional<TipoComprobanteCountAggregateOutputType> | number
          }
        }
      }
      TipoMovimiento: {
        payload: Prisma.$TipoMovimientoPayload<ExtArgs>
        fields: Prisma.TipoMovimientoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TipoMovimientoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TipoMovimientoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TipoMovimientoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TipoMovimientoPayload>
          }
          findFirst: {
            args: Prisma.TipoMovimientoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TipoMovimientoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TipoMovimientoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TipoMovimientoPayload>
          }
          findMany: {
            args: Prisma.TipoMovimientoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TipoMovimientoPayload>[]
          }
          create: {
            args: Prisma.TipoMovimientoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TipoMovimientoPayload>
          }
          createMany: {
            args: Prisma.TipoMovimientoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TipoMovimientoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TipoMovimientoPayload>[]
          }
          delete: {
            args: Prisma.TipoMovimientoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TipoMovimientoPayload>
          }
          update: {
            args: Prisma.TipoMovimientoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TipoMovimientoPayload>
          }
          deleteMany: {
            args: Prisma.TipoMovimientoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TipoMovimientoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TipoMovimientoUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TipoMovimientoPayload>[]
          }
          upsert: {
            args: Prisma.TipoMovimientoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TipoMovimientoPayload>
          }
          aggregate: {
            args: Prisma.TipoMovimientoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTipoMovimiento>
          }
          groupBy: {
            args: Prisma.TipoMovimientoGroupByArgs<ExtArgs>
            result: $Utils.Optional<TipoMovimientoGroupByOutputType>[]
          }
          count: {
            args: Prisma.TipoMovimientoCountArgs<ExtArgs>
            result: $Utils.Optional<TipoMovimientoCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    rubro?: RubroOmit
    unidad?: UnidadOmit
    marca?: MarcaOmit
    producto?: ProductoOmit
    deposito?: DepositoOmit
    stockPorDeposito?: StockPorDepositoOmit
    movimientoStock?: MovimientoStockOmit
    detalleMovimiento?: DetalleMovimientoOmit
    tipoComprobante?: TipoComprobanteOmit
    tipoMovimiento?: TipoMovimientoOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type RubroCountOutputType
   */

  export type RubroCountOutputType = {
    productos: number
  }

  export type RubroCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    productos?: boolean | RubroCountOutputTypeCountProductosArgs
  }

  // Custom InputTypes
  /**
   * RubroCountOutputType without action
   */
  export type RubroCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RubroCountOutputType
     */
    select?: RubroCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * RubroCountOutputType without action
   */
  export type RubroCountOutputTypeCountProductosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductoWhereInput
  }


  /**
   * Count Type UnidadCountOutputType
   */

  export type UnidadCountOutputType = {
    productos: number
  }

  export type UnidadCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    productos?: boolean | UnidadCountOutputTypeCountProductosArgs
  }

  // Custom InputTypes
  /**
   * UnidadCountOutputType without action
   */
  export type UnidadCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnidadCountOutputType
     */
    select?: UnidadCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UnidadCountOutputType without action
   */
  export type UnidadCountOutputTypeCountProductosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductoWhereInput
  }


  /**
   * Count Type MarcaCountOutputType
   */

  export type MarcaCountOutputType = {
    productos: number
  }

  export type MarcaCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    productos?: boolean | MarcaCountOutputTypeCountProductosArgs
  }

  // Custom InputTypes
  /**
   * MarcaCountOutputType without action
   */
  export type MarcaCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MarcaCountOutputType
     */
    select?: MarcaCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * MarcaCountOutputType without action
   */
  export type MarcaCountOutputTypeCountProductosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductoWhereInput
  }


  /**
   * Count Type ProductoCountOutputType
   */

  export type ProductoCountOutputType = {
    stockProductos: number
  }

  export type ProductoCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    stockProductos?: boolean | ProductoCountOutputTypeCountStockProductosArgs
  }

  // Custom InputTypes
  /**
   * ProductoCountOutputType without action
   */
  export type ProductoCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductoCountOutputType
     */
    select?: ProductoCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProductoCountOutputType without action
   */
  export type ProductoCountOutputTypeCountStockProductosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StockPorDepositoWhereInput
  }


  /**
   * Count Type DepositoCountOutputType
   */

  export type DepositoCountOutputType = {
    movimientos: number
    stock: number
  }

  export type DepositoCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    movimientos?: boolean | DepositoCountOutputTypeCountMovimientosArgs
    stock?: boolean | DepositoCountOutputTypeCountStockArgs
  }

  // Custom InputTypes
  /**
   * DepositoCountOutputType without action
   */
  export type DepositoCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DepositoCountOutputType
     */
    select?: DepositoCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * DepositoCountOutputType without action
   */
  export type DepositoCountOutputTypeCountMovimientosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MovimientoStockWhereInput
  }

  /**
   * DepositoCountOutputType without action
   */
  export type DepositoCountOutputTypeCountStockArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StockPorDepositoWhereInput
  }


  /**
   * Count Type StockPorDepositoCountOutputType
   */

  export type StockPorDepositoCountOutputType = {
    detallesMovimiento: number
  }

  export type StockPorDepositoCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    detallesMovimiento?: boolean | StockPorDepositoCountOutputTypeCountDetallesMovimientoArgs
  }

  // Custom InputTypes
  /**
   * StockPorDepositoCountOutputType without action
   */
  export type StockPorDepositoCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockPorDepositoCountOutputType
     */
    select?: StockPorDepositoCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * StockPorDepositoCountOutputType without action
   */
  export type StockPorDepositoCountOutputTypeCountDetallesMovimientoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DetalleMovimientoWhereInput
  }


  /**
   * Count Type MovimientoStockCountOutputType
   */

  export type MovimientoStockCountOutputType = {
    detalles: number
  }

  export type MovimientoStockCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    detalles?: boolean | MovimientoStockCountOutputTypeCountDetallesArgs
  }

  // Custom InputTypes
  /**
   * MovimientoStockCountOutputType without action
   */
  export type MovimientoStockCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MovimientoStockCountOutputType
     */
    select?: MovimientoStockCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * MovimientoStockCountOutputType without action
   */
  export type MovimientoStockCountOutputTypeCountDetallesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DetalleMovimientoWhereInput
  }


  /**
   * Count Type TipoComprobanteCountOutputType
   */

  export type TipoComprobanteCountOutputType = {
    movimientos: number
  }

  export type TipoComprobanteCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    movimientos?: boolean | TipoComprobanteCountOutputTypeCountMovimientosArgs
  }

  // Custom InputTypes
  /**
   * TipoComprobanteCountOutputType without action
   */
  export type TipoComprobanteCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TipoComprobanteCountOutputType
     */
    select?: TipoComprobanteCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TipoComprobanteCountOutputType without action
   */
  export type TipoComprobanteCountOutputTypeCountMovimientosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MovimientoStockWhereInput
  }


  /**
   * Count Type TipoMovimientoCountOutputType
   */

  export type TipoMovimientoCountOutputType = {
    movimientos: number
  }

  export type TipoMovimientoCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    movimientos?: boolean | TipoMovimientoCountOutputTypeCountMovimientosArgs
  }

  // Custom InputTypes
  /**
   * TipoMovimientoCountOutputType without action
   */
  export type TipoMovimientoCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TipoMovimientoCountOutputType
     */
    select?: TipoMovimientoCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TipoMovimientoCountOutputType without action
   */
  export type TipoMovimientoCountOutputTypeCountMovimientosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MovimientoStockWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Rubro
   */

  export type AggregateRubro = {
    _count: RubroCountAggregateOutputType | null
    _avg: RubroAvgAggregateOutputType | null
    _sum: RubroSumAggregateOutputType | null
    _min: RubroMinAggregateOutputType | null
    _max: RubroMaxAggregateOutputType | null
  }

  export type RubroAvgAggregateOutputType = {
    id: number | null
  }

  export type RubroSumAggregateOutputType = {
    id: number | null
  }

  export type RubroMinAggregateOutputType = {
    id: number | null
    nombre: string | null
  }

  export type RubroMaxAggregateOutputType = {
    id: number | null
    nombre: string | null
  }

  export type RubroCountAggregateOutputType = {
    id: number
    nombre: number
    _all: number
  }


  export type RubroAvgAggregateInputType = {
    id?: true
  }

  export type RubroSumAggregateInputType = {
    id?: true
  }

  export type RubroMinAggregateInputType = {
    id?: true
    nombre?: true
  }

  export type RubroMaxAggregateInputType = {
    id?: true
    nombre?: true
  }

  export type RubroCountAggregateInputType = {
    id?: true
    nombre?: true
    _all?: true
  }

  export type RubroAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Rubro to aggregate.
     */
    where?: RubroWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Rubros to fetch.
     */
    orderBy?: RubroOrderByWithRelationInput | RubroOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RubroWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Rubros from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Rubros.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Rubros
    **/
    _count?: true | RubroCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RubroAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RubroSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RubroMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RubroMaxAggregateInputType
  }

  export type GetRubroAggregateType<T extends RubroAggregateArgs> = {
        [P in keyof T & keyof AggregateRubro]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRubro[P]>
      : GetScalarType<T[P], AggregateRubro[P]>
  }




  export type RubroGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RubroWhereInput
    orderBy?: RubroOrderByWithAggregationInput | RubroOrderByWithAggregationInput[]
    by: RubroScalarFieldEnum[] | RubroScalarFieldEnum
    having?: RubroScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RubroCountAggregateInputType | true
    _avg?: RubroAvgAggregateInputType
    _sum?: RubroSumAggregateInputType
    _min?: RubroMinAggregateInputType
    _max?: RubroMaxAggregateInputType
  }

  export type RubroGroupByOutputType = {
    id: number
    nombre: string
    _count: RubroCountAggregateOutputType | null
    _avg: RubroAvgAggregateOutputType | null
    _sum: RubroSumAggregateOutputType | null
    _min: RubroMinAggregateOutputType | null
    _max: RubroMaxAggregateOutputType | null
  }

  type GetRubroGroupByPayload<T extends RubroGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RubroGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RubroGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RubroGroupByOutputType[P]>
            : GetScalarType<T[P], RubroGroupByOutputType[P]>
        }
      >
    >


  export type RubroSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    productos?: boolean | Rubro$productosArgs<ExtArgs>
    _count?: boolean | RubroCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["rubro"]>

  export type RubroSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
  }, ExtArgs["result"]["rubro"]>

  export type RubroSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
  }, ExtArgs["result"]["rubro"]>

  export type RubroSelectScalar = {
    id?: boolean
    nombre?: boolean
  }

  export type RubroOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "nombre", ExtArgs["result"]["rubro"]>
  export type RubroInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    productos?: boolean | Rubro$productosArgs<ExtArgs>
    _count?: boolean | RubroCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type RubroIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type RubroIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $RubroPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Rubro"
    objects: {
      productos: Prisma.$ProductoPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      nombre: string
    }, ExtArgs["result"]["rubro"]>
    composites: {}
  }

  type RubroGetPayload<S extends boolean | null | undefined | RubroDefaultArgs> = $Result.GetResult<Prisma.$RubroPayload, S>

  type RubroCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RubroFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RubroCountAggregateInputType | true
    }

  export interface RubroDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Rubro'], meta: { name: 'Rubro' } }
    /**
     * Find zero or one Rubro that matches the filter.
     * @param {RubroFindUniqueArgs} args - Arguments to find a Rubro
     * @example
     * // Get one Rubro
     * const rubro = await prisma.rubro.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RubroFindUniqueArgs>(args: SelectSubset<T, RubroFindUniqueArgs<ExtArgs>>): Prisma__RubroClient<$Result.GetResult<Prisma.$RubroPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Rubro that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RubroFindUniqueOrThrowArgs} args - Arguments to find a Rubro
     * @example
     * // Get one Rubro
     * const rubro = await prisma.rubro.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RubroFindUniqueOrThrowArgs>(args: SelectSubset<T, RubroFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RubroClient<$Result.GetResult<Prisma.$RubroPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Rubro that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RubroFindFirstArgs} args - Arguments to find a Rubro
     * @example
     * // Get one Rubro
     * const rubro = await prisma.rubro.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RubroFindFirstArgs>(args?: SelectSubset<T, RubroFindFirstArgs<ExtArgs>>): Prisma__RubroClient<$Result.GetResult<Prisma.$RubroPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Rubro that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RubroFindFirstOrThrowArgs} args - Arguments to find a Rubro
     * @example
     * // Get one Rubro
     * const rubro = await prisma.rubro.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RubroFindFirstOrThrowArgs>(args?: SelectSubset<T, RubroFindFirstOrThrowArgs<ExtArgs>>): Prisma__RubroClient<$Result.GetResult<Prisma.$RubroPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Rubros that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RubroFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Rubros
     * const rubros = await prisma.rubro.findMany()
     * 
     * // Get first 10 Rubros
     * const rubros = await prisma.rubro.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const rubroWithIdOnly = await prisma.rubro.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RubroFindManyArgs>(args?: SelectSubset<T, RubroFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RubroPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Rubro.
     * @param {RubroCreateArgs} args - Arguments to create a Rubro.
     * @example
     * // Create one Rubro
     * const Rubro = await prisma.rubro.create({
     *   data: {
     *     // ... data to create a Rubro
     *   }
     * })
     * 
     */
    create<T extends RubroCreateArgs>(args: SelectSubset<T, RubroCreateArgs<ExtArgs>>): Prisma__RubroClient<$Result.GetResult<Prisma.$RubroPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Rubros.
     * @param {RubroCreateManyArgs} args - Arguments to create many Rubros.
     * @example
     * // Create many Rubros
     * const rubro = await prisma.rubro.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RubroCreateManyArgs>(args?: SelectSubset<T, RubroCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Rubros and returns the data saved in the database.
     * @param {RubroCreateManyAndReturnArgs} args - Arguments to create many Rubros.
     * @example
     * // Create many Rubros
     * const rubro = await prisma.rubro.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Rubros and only return the `id`
     * const rubroWithIdOnly = await prisma.rubro.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RubroCreateManyAndReturnArgs>(args?: SelectSubset<T, RubroCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RubroPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Rubro.
     * @param {RubroDeleteArgs} args - Arguments to delete one Rubro.
     * @example
     * // Delete one Rubro
     * const Rubro = await prisma.rubro.delete({
     *   where: {
     *     // ... filter to delete one Rubro
     *   }
     * })
     * 
     */
    delete<T extends RubroDeleteArgs>(args: SelectSubset<T, RubroDeleteArgs<ExtArgs>>): Prisma__RubroClient<$Result.GetResult<Prisma.$RubroPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Rubro.
     * @param {RubroUpdateArgs} args - Arguments to update one Rubro.
     * @example
     * // Update one Rubro
     * const rubro = await prisma.rubro.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RubroUpdateArgs>(args: SelectSubset<T, RubroUpdateArgs<ExtArgs>>): Prisma__RubroClient<$Result.GetResult<Prisma.$RubroPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Rubros.
     * @param {RubroDeleteManyArgs} args - Arguments to filter Rubros to delete.
     * @example
     * // Delete a few Rubros
     * const { count } = await prisma.rubro.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RubroDeleteManyArgs>(args?: SelectSubset<T, RubroDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Rubros.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RubroUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Rubros
     * const rubro = await prisma.rubro.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RubroUpdateManyArgs>(args: SelectSubset<T, RubroUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Rubros and returns the data updated in the database.
     * @param {RubroUpdateManyAndReturnArgs} args - Arguments to update many Rubros.
     * @example
     * // Update many Rubros
     * const rubro = await prisma.rubro.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Rubros and only return the `id`
     * const rubroWithIdOnly = await prisma.rubro.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RubroUpdateManyAndReturnArgs>(args: SelectSubset<T, RubroUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RubroPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Rubro.
     * @param {RubroUpsertArgs} args - Arguments to update or create a Rubro.
     * @example
     * // Update or create a Rubro
     * const rubro = await prisma.rubro.upsert({
     *   create: {
     *     // ... data to create a Rubro
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Rubro we want to update
     *   }
     * })
     */
    upsert<T extends RubroUpsertArgs>(args: SelectSubset<T, RubroUpsertArgs<ExtArgs>>): Prisma__RubroClient<$Result.GetResult<Prisma.$RubroPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Rubros.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RubroCountArgs} args - Arguments to filter Rubros to count.
     * @example
     * // Count the number of Rubros
     * const count = await prisma.rubro.count({
     *   where: {
     *     // ... the filter for the Rubros we want to count
     *   }
     * })
    **/
    count<T extends RubroCountArgs>(
      args?: Subset<T, RubroCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RubroCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Rubro.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RubroAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RubroAggregateArgs>(args: Subset<T, RubroAggregateArgs>): Prisma.PrismaPromise<GetRubroAggregateType<T>>

    /**
     * Group by Rubro.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RubroGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RubroGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RubroGroupByArgs['orderBy'] }
        : { orderBy?: RubroGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RubroGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRubroGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Rubro model
   */
  readonly fields: RubroFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Rubro.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RubroClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    productos<T extends Rubro$productosArgs<ExtArgs> = {}>(args?: Subset<T, Rubro$productosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Rubro model
   */
  interface RubroFieldRefs {
    readonly id: FieldRef<"Rubro", 'Int'>
    readonly nombre: FieldRef<"Rubro", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Rubro findUnique
   */
  export type RubroFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rubro
     */
    select?: RubroSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Rubro
     */
    omit?: RubroOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RubroInclude<ExtArgs> | null
    /**
     * Filter, which Rubro to fetch.
     */
    where: RubroWhereUniqueInput
  }

  /**
   * Rubro findUniqueOrThrow
   */
  export type RubroFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rubro
     */
    select?: RubroSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Rubro
     */
    omit?: RubroOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RubroInclude<ExtArgs> | null
    /**
     * Filter, which Rubro to fetch.
     */
    where: RubroWhereUniqueInput
  }

  /**
   * Rubro findFirst
   */
  export type RubroFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rubro
     */
    select?: RubroSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Rubro
     */
    omit?: RubroOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RubroInclude<ExtArgs> | null
    /**
     * Filter, which Rubro to fetch.
     */
    where?: RubroWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Rubros to fetch.
     */
    orderBy?: RubroOrderByWithRelationInput | RubroOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Rubros.
     */
    cursor?: RubroWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Rubros from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Rubros.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Rubros.
     */
    distinct?: RubroScalarFieldEnum | RubroScalarFieldEnum[]
  }

  /**
   * Rubro findFirstOrThrow
   */
  export type RubroFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rubro
     */
    select?: RubroSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Rubro
     */
    omit?: RubroOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RubroInclude<ExtArgs> | null
    /**
     * Filter, which Rubro to fetch.
     */
    where?: RubroWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Rubros to fetch.
     */
    orderBy?: RubroOrderByWithRelationInput | RubroOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Rubros.
     */
    cursor?: RubroWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Rubros from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Rubros.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Rubros.
     */
    distinct?: RubroScalarFieldEnum | RubroScalarFieldEnum[]
  }

  /**
   * Rubro findMany
   */
  export type RubroFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rubro
     */
    select?: RubroSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Rubro
     */
    omit?: RubroOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RubroInclude<ExtArgs> | null
    /**
     * Filter, which Rubros to fetch.
     */
    where?: RubroWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Rubros to fetch.
     */
    orderBy?: RubroOrderByWithRelationInput | RubroOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Rubros.
     */
    cursor?: RubroWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Rubros from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Rubros.
     */
    skip?: number
    distinct?: RubroScalarFieldEnum | RubroScalarFieldEnum[]
  }

  /**
   * Rubro create
   */
  export type RubroCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rubro
     */
    select?: RubroSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Rubro
     */
    omit?: RubroOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RubroInclude<ExtArgs> | null
    /**
     * The data needed to create a Rubro.
     */
    data: XOR<RubroCreateInput, RubroUncheckedCreateInput>
  }

  /**
   * Rubro createMany
   */
  export type RubroCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Rubros.
     */
    data: RubroCreateManyInput | RubroCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Rubro createManyAndReturn
   */
  export type RubroCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rubro
     */
    select?: RubroSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Rubro
     */
    omit?: RubroOmit<ExtArgs> | null
    /**
     * The data used to create many Rubros.
     */
    data: RubroCreateManyInput | RubroCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Rubro update
   */
  export type RubroUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rubro
     */
    select?: RubroSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Rubro
     */
    omit?: RubroOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RubroInclude<ExtArgs> | null
    /**
     * The data needed to update a Rubro.
     */
    data: XOR<RubroUpdateInput, RubroUncheckedUpdateInput>
    /**
     * Choose, which Rubro to update.
     */
    where: RubroWhereUniqueInput
  }

  /**
   * Rubro updateMany
   */
  export type RubroUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Rubros.
     */
    data: XOR<RubroUpdateManyMutationInput, RubroUncheckedUpdateManyInput>
    /**
     * Filter which Rubros to update
     */
    where?: RubroWhereInput
    /**
     * Limit how many Rubros to update.
     */
    limit?: number
  }

  /**
   * Rubro updateManyAndReturn
   */
  export type RubroUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rubro
     */
    select?: RubroSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Rubro
     */
    omit?: RubroOmit<ExtArgs> | null
    /**
     * The data used to update Rubros.
     */
    data: XOR<RubroUpdateManyMutationInput, RubroUncheckedUpdateManyInput>
    /**
     * Filter which Rubros to update
     */
    where?: RubroWhereInput
    /**
     * Limit how many Rubros to update.
     */
    limit?: number
  }

  /**
   * Rubro upsert
   */
  export type RubroUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rubro
     */
    select?: RubroSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Rubro
     */
    omit?: RubroOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RubroInclude<ExtArgs> | null
    /**
     * The filter to search for the Rubro to update in case it exists.
     */
    where: RubroWhereUniqueInput
    /**
     * In case the Rubro found by the `where` argument doesn't exist, create a new Rubro with this data.
     */
    create: XOR<RubroCreateInput, RubroUncheckedCreateInput>
    /**
     * In case the Rubro was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RubroUpdateInput, RubroUncheckedUpdateInput>
  }

  /**
   * Rubro delete
   */
  export type RubroDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rubro
     */
    select?: RubroSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Rubro
     */
    omit?: RubroOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RubroInclude<ExtArgs> | null
    /**
     * Filter which Rubro to delete.
     */
    where: RubroWhereUniqueInput
  }

  /**
   * Rubro deleteMany
   */
  export type RubroDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Rubros to delete
     */
    where?: RubroWhereInput
    /**
     * Limit how many Rubros to delete.
     */
    limit?: number
  }

  /**
   * Rubro.productos
   */
  export type Rubro$productosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Producto
     */
    select?: ProductoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Producto
     */
    omit?: ProductoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductoInclude<ExtArgs> | null
    where?: ProductoWhereInput
    orderBy?: ProductoOrderByWithRelationInput | ProductoOrderByWithRelationInput[]
    cursor?: ProductoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProductoScalarFieldEnum | ProductoScalarFieldEnum[]
  }

  /**
   * Rubro without action
   */
  export type RubroDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rubro
     */
    select?: RubroSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Rubro
     */
    omit?: RubroOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RubroInclude<ExtArgs> | null
  }


  /**
   * Model Unidad
   */

  export type AggregateUnidad = {
    _count: UnidadCountAggregateOutputType | null
    _avg: UnidadAvgAggregateOutputType | null
    _sum: UnidadSumAggregateOutputType | null
    _min: UnidadMinAggregateOutputType | null
    _max: UnidadMaxAggregateOutputType | null
  }

  export type UnidadAvgAggregateOutputType = {
    id: number | null
  }

  export type UnidadSumAggregateOutputType = {
    id: number | null
  }

  export type UnidadMinAggregateOutputType = {
    id: number | null
    nombre: string | null
  }

  export type UnidadMaxAggregateOutputType = {
    id: number | null
    nombre: string | null
  }

  export type UnidadCountAggregateOutputType = {
    id: number
    nombre: number
    _all: number
  }


  export type UnidadAvgAggregateInputType = {
    id?: true
  }

  export type UnidadSumAggregateInputType = {
    id?: true
  }

  export type UnidadMinAggregateInputType = {
    id?: true
    nombre?: true
  }

  export type UnidadMaxAggregateInputType = {
    id?: true
    nombre?: true
  }

  export type UnidadCountAggregateInputType = {
    id?: true
    nombre?: true
    _all?: true
  }

  export type UnidadAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Unidad to aggregate.
     */
    where?: UnidadWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Unidads to fetch.
     */
    orderBy?: UnidadOrderByWithRelationInput | UnidadOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UnidadWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Unidads from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Unidads.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Unidads
    **/
    _count?: true | UnidadCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UnidadAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UnidadSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UnidadMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UnidadMaxAggregateInputType
  }

  export type GetUnidadAggregateType<T extends UnidadAggregateArgs> = {
        [P in keyof T & keyof AggregateUnidad]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUnidad[P]>
      : GetScalarType<T[P], AggregateUnidad[P]>
  }




  export type UnidadGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UnidadWhereInput
    orderBy?: UnidadOrderByWithAggregationInput | UnidadOrderByWithAggregationInput[]
    by: UnidadScalarFieldEnum[] | UnidadScalarFieldEnum
    having?: UnidadScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UnidadCountAggregateInputType | true
    _avg?: UnidadAvgAggregateInputType
    _sum?: UnidadSumAggregateInputType
    _min?: UnidadMinAggregateInputType
    _max?: UnidadMaxAggregateInputType
  }

  export type UnidadGroupByOutputType = {
    id: number
    nombre: string
    _count: UnidadCountAggregateOutputType | null
    _avg: UnidadAvgAggregateOutputType | null
    _sum: UnidadSumAggregateOutputType | null
    _min: UnidadMinAggregateOutputType | null
    _max: UnidadMaxAggregateOutputType | null
  }

  type GetUnidadGroupByPayload<T extends UnidadGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UnidadGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UnidadGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UnidadGroupByOutputType[P]>
            : GetScalarType<T[P], UnidadGroupByOutputType[P]>
        }
      >
    >


  export type UnidadSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    productos?: boolean | Unidad$productosArgs<ExtArgs>
    _count?: boolean | UnidadCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["unidad"]>

  export type UnidadSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
  }, ExtArgs["result"]["unidad"]>

  export type UnidadSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
  }, ExtArgs["result"]["unidad"]>

  export type UnidadSelectScalar = {
    id?: boolean
    nombre?: boolean
  }

  export type UnidadOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "nombre", ExtArgs["result"]["unidad"]>
  export type UnidadInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    productos?: boolean | Unidad$productosArgs<ExtArgs>
    _count?: boolean | UnidadCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UnidadIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UnidadIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UnidadPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Unidad"
    objects: {
      productos: Prisma.$ProductoPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      nombre: string
    }, ExtArgs["result"]["unidad"]>
    composites: {}
  }

  type UnidadGetPayload<S extends boolean | null | undefined | UnidadDefaultArgs> = $Result.GetResult<Prisma.$UnidadPayload, S>

  type UnidadCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UnidadFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UnidadCountAggregateInputType | true
    }

  export interface UnidadDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Unidad'], meta: { name: 'Unidad' } }
    /**
     * Find zero or one Unidad that matches the filter.
     * @param {UnidadFindUniqueArgs} args - Arguments to find a Unidad
     * @example
     * // Get one Unidad
     * const unidad = await prisma.unidad.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UnidadFindUniqueArgs>(args: SelectSubset<T, UnidadFindUniqueArgs<ExtArgs>>): Prisma__UnidadClient<$Result.GetResult<Prisma.$UnidadPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Unidad that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UnidadFindUniqueOrThrowArgs} args - Arguments to find a Unidad
     * @example
     * // Get one Unidad
     * const unidad = await prisma.unidad.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UnidadFindUniqueOrThrowArgs>(args: SelectSubset<T, UnidadFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UnidadClient<$Result.GetResult<Prisma.$UnidadPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Unidad that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UnidadFindFirstArgs} args - Arguments to find a Unidad
     * @example
     * // Get one Unidad
     * const unidad = await prisma.unidad.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UnidadFindFirstArgs>(args?: SelectSubset<T, UnidadFindFirstArgs<ExtArgs>>): Prisma__UnidadClient<$Result.GetResult<Prisma.$UnidadPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Unidad that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UnidadFindFirstOrThrowArgs} args - Arguments to find a Unidad
     * @example
     * // Get one Unidad
     * const unidad = await prisma.unidad.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UnidadFindFirstOrThrowArgs>(args?: SelectSubset<T, UnidadFindFirstOrThrowArgs<ExtArgs>>): Prisma__UnidadClient<$Result.GetResult<Prisma.$UnidadPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Unidads that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UnidadFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Unidads
     * const unidads = await prisma.unidad.findMany()
     * 
     * // Get first 10 Unidads
     * const unidads = await prisma.unidad.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const unidadWithIdOnly = await prisma.unidad.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UnidadFindManyArgs>(args?: SelectSubset<T, UnidadFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UnidadPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Unidad.
     * @param {UnidadCreateArgs} args - Arguments to create a Unidad.
     * @example
     * // Create one Unidad
     * const Unidad = await prisma.unidad.create({
     *   data: {
     *     // ... data to create a Unidad
     *   }
     * })
     * 
     */
    create<T extends UnidadCreateArgs>(args: SelectSubset<T, UnidadCreateArgs<ExtArgs>>): Prisma__UnidadClient<$Result.GetResult<Prisma.$UnidadPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Unidads.
     * @param {UnidadCreateManyArgs} args - Arguments to create many Unidads.
     * @example
     * // Create many Unidads
     * const unidad = await prisma.unidad.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UnidadCreateManyArgs>(args?: SelectSubset<T, UnidadCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Unidads and returns the data saved in the database.
     * @param {UnidadCreateManyAndReturnArgs} args - Arguments to create many Unidads.
     * @example
     * // Create many Unidads
     * const unidad = await prisma.unidad.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Unidads and only return the `id`
     * const unidadWithIdOnly = await prisma.unidad.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UnidadCreateManyAndReturnArgs>(args?: SelectSubset<T, UnidadCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UnidadPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Unidad.
     * @param {UnidadDeleteArgs} args - Arguments to delete one Unidad.
     * @example
     * // Delete one Unidad
     * const Unidad = await prisma.unidad.delete({
     *   where: {
     *     // ... filter to delete one Unidad
     *   }
     * })
     * 
     */
    delete<T extends UnidadDeleteArgs>(args: SelectSubset<T, UnidadDeleteArgs<ExtArgs>>): Prisma__UnidadClient<$Result.GetResult<Prisma.$UnidadPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Unidad.
     * @param {UnidadUpdateArgs} args - Arguments to update one Unidad.
     * @example
     * // Update one Unidad
     * const unidad = await prisma.unidad.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UnidadUpdateArgs>(args: SelectSubset<T, UnidadUpdateArgs<ExtArgs>>): Prisma__UnidadClient<$Result.GetResult<Prisma.$UnidadPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Unidads.
     * @param {UnidadDeleteManyArgs} args - Arguments to filter Unidads to delete.
     * @example
     * // Delete a few Unidads
     * const { count } = await prisma.unidad.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UnidadDeleteManyArgs>(args?: SelectSubset<T, UnidadDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Unidads.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UnidadUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Unidads
     * const unidad = await prisma.unidad.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UnidadUpdateManyArgs>(args: SelectSubset<T, UnidadUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Unidads and returns the data updated in the database.
     * @param {UnidadUpdateManyAndReturnArgs} args - Arguments to update many Unidads.
     * @example
     * // Update many Unidads
     * const unidad = await prisma.unidad.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Unidads and only return the `id`
     * const unidadWithIdOnly = await prisma.unidad.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UnidadUpdateManyAndReturnArgs>(args: SelectSubset<T, UnidadUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UnidadPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Unidad.
     * @param {UnidadUpsertArgs} args - Arguments to update or create a Unidad.
     * @example
     * // Update or create a Unidad
     * const unidad = await prisma.unidad.upsert({
     *   create: {
     *     // ... data to create a Unidad
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Unidad we want to update
     *   }
     * })
     */
    upsert<T extends UnidadUpsertArgs>(args: SelectSubset<T, UnidadUpsertArgs<ExtArgs>>): Prisma__UnidadClient<$Result.GetResult<Prisma.$UnidadPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Unidads.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UnidadCountArgs} args - Arguments to filter Unidads to count.
     * @example
     * // Count the number of Unidads
     * const count = await prisma.unidad.count({
     *   where: {
     *     // ... the filter for the Unidads we want to count
     *   }
     * })
    **/
    count<T extends UnidadCountArgs>(
      args?: Subset<T, UnidadCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UnidadCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Unidad.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UnidadAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UnidadAggregateArgs>(args: Subset<T, UnidadAggregateArgs>): Prisma.PrismaPromise<GetUnidadAggregateType<T>>

    /**
     * Group by Unidad.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UnidadGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UnidadGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UnidadGroupByArgs['orderBy'] }
        : { orderBy?: UnidadGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UnidadGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUnidadGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Unidad model
   */
  readonly fields: UnidadFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Unidad.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UnidadClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    productos<T extends Unidad$productosArgs<ExtArgs> = {}>(args?: Subset<T, Unidad$productosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Unidad model
   */
  interface UnidadFieldRefs {
    readonly id: FieldRef<"Unidad", 'Int'>
    readonly nombre: FieldRef<"Unidad", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Unidad findUnique
   */
  export type UnidadFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Unidad
     */
    select?: UnidadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Unidad
     */
    omit?: UnidadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UnidadInclude<ExtArgs> | null
    /**
     * Filter, which Unidad to fetch.
     */
    where: UnidadWhereUniqueInput
  }

  /**
   * Unidad findUniqueOrThrow
   */
  export type UnidadFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Unidad
     */
    select?: UnidadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Unidad
     */
    omit?: UnidadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UnidadInclude<ExtArgs> | null
    /**
     * Filter, which Unidad to fetch.
     */
    where: UnidadWhereUniqueInput
  }

  /**
   * Unidad findFirst
   */
  export type UnidadFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Unidad
     */
    select?: UnidadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Unidad
     */
    omit?: UnidadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UnidadInclude<ExtArgs> | null
    /**
     * Filter, which Unidad to fetch.
     */
    where?: UnidadWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Unidads to fetch.
     */
    orderBy?: UnidadOrderByWithRelationInput | UnidadOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Unidads.
     */
    cursor?: UnidadWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Unidads from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Unidads.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Unidads.
     */
    distinct?: UnidadScalarFieldEnum | UnidadScalarFieldEnum[]
  }

  /**
   * Unidad findFirstOrThrow
   */
  export type UnidadFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Unidad
     */
    select?: UnidadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Unidad
     */
    omit?: UnidadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UnidadInclude<ExtArgs> | null
    /**
     * Filter, which Unidad to fetch.
     */
    where?: UnidadWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Unidads to fetch.
     */
    orderBy?: UnidadOrderByWithRelationInput | UnidadOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Unidads.
     */
    cursor?: UnidadWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Unidads from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Unidads.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Unidads.
     */
    distinct?: UnidadScalarFieldEnum | UnidadScalarFieldEnum[]
  }

  /**
   * Unidad findMany
   */
  export type UnidadFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Unidad
     */
    select?: UnidadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Unidad
     */
    omit?: UnidadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UnidadInclude<ExtArgs> | null
    /**
     * Filter, which Unidads to fetch.
     */
    where?: UnidadWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Unidads to fetch.
     */
    orderBy?: UnidadOrderByWithRelationInput | UnidadOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Unidads.
     */
    cursor?: UnidadWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Unidads from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Unidads.
     */
    skip?: number
    distinct?: UnidadScalarFieldEnum | UnidadScalarFieldEnum[]
  }

  /**
   * Unidad create
   */
  export type UnidadCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Unidad
     */
    select?: UnidadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Unidad
     */
    omit?: UnidadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UnidadInclude<ExtArgs> | null
    /**
     * The data needed to create a Unidad.
     */
    data: XOR<UnidadCreateInput, UnidadUncheckedCreateInput>
  }

  /**
   * Unidad createMany
   */
  export type UnidadCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Unidads.
     */
    data: UnidadCreateManyInput | UnidadCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Unidad createManyAndReturn
   */
  export type UnidadCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Unidad
     */
    select?: UnidadSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Unidad
     */
    omit?: UnidadOmit<ExtArgs> | null
    /**
     * The data used to create many Unidads.
     */
    data: UnidadCreateManyInput | UnidadCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Unidad update
   */
  export type UnidadUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Unidad
     */
    select?: UnidadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Unidad
     */
    omit?: UnidadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UnidadInclude<ExtArgs> | null
    /**
     * The data needed to update a Unidad.
     */
    data: XOR<UnidadUpdateInput, UnidadUncheckedUpdateInput>
    /**
     * Choose, which Unidad to update.
     */
    where: UnidadWhereUniqueInput
  }

  /**
   * Unidad updateMany
   */
  export type UnidadUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Unidads.
     */
    data: XOR<UnidadUpdateManyMutationInput, UnidadUncheckedUpdateManyInput>
    /**
     * Filter which Unidads to update
     */
    where?: UnidadWhereInput
    /**
     * Limit how many Unidads to update.
     */
    limit?: number
  }

  /**
   * Unidad updateManyAndReturn
   */
  export type UnidadUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Unidad
     */
    select?: UnidadSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Unidad
     */
    omit?: UnidadOmit<ExtArgs> | null
    /**
     * The data used to update Unidads.
     */
    data: XOR<UnidadUpdateManyMutationInput, UnidadUncheckedUpdateManyInput>
    /**
     * Filter which Unidads to update
     */
    where?: UnidadWhereInput
    /**
     * Limit how many Unidads to update.
     */
    limit?: number
  }

  /**
   * Unidad upsert
   */
  export type UnidadUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Unidad
     */
    select?: UnidadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Unidad
     */
    omit?: UnidadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UnidadInclude<ExtArgs> | null
    /**
     * The filter to search for the Unidad to update in case it exists.
     */
    where: UnidadWhereUniqueInput
    /**
     * In case the Unidad found by the `where` argument doesn't exist, create a new Unidad with this data.
     */
    create: XOR<UnidadCreateInput, UnidadUncheckedCreateInput>
    /**
     * In case the Unidad was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UnidadUpdateInput, UnidadUncheckedUpdateInput>
  }

  /**
   * Unidad delete
   */
  export type UnidadDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Unidad
     */
    select?: UnidadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Unidad
     */
    omit?: UnidadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UnidadInclude<ExtArgs> | null
    /**
     * Filter which Unidad to delete.
     */
    where: UnidadWhereUniqueInput
  }

  /**
   * Unidad deleteMany
   */
  export type UnidadDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Unidads to delete
     */
    where?: UnidadWhereInput
    /**
     * Limit how many Unidads to delete.
     */
    limit?: number
  }

  /**
   * Unidad.productos
   */
  export type Unidad$productosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Producto
     */
    select?: ProductoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Producto
     */
    omit?: ProductoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductoInclude<ExtArgs> | null
    where?: ProductoWhereInput
    orderBy?: ProductoOrderByWithRelationInput | ProductoOrderByWithRelationInput[]
    cursor?: ProductoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProductoScalarFieldEnum | ProductoScalarFieldEnum[]
  }

  /**
   * Unidad without action
   */
  export type UnidadDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Unidad
     */
    select?: UnidadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Unidad
     */
    omit?: UnidadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UnidadInclude<ExtArgs> | null
  }


  /**
   * Model Marca
   */

  export type AggregateMarca = {
    _count: MarcaCountAggregateOutputType | null
    _avg: MarcaAvgAggregateOutputType | null
    _sum: MarcaSumAggregateOutputType | null
    _min: MarcaMinAggregateOutputType | null
    _max: MarcaMaxAggregateOutputType | null
  }

  export type MarcaAvgAggregateOutputType = {
    id: number | null
  }

  export type MarcaSumAggregateOutputType = {
    id: number | null
  }

  export type MarcaMinAggregateOutputType = {
    id: number | null
    nombre: string | null
  }

  export type MarcaMaxAggregateOutputType = {
    id: number | null
    nombre: string | null
  }

  export type MarcaCountAggregateOutputType = {
    id: number
    nombre: number
    _all: number
  }


  export type MarcaAvgAggregateInputType = {
    id?: true
  }

  export type MarcaSumAggregateInputType = {
    id?: true
  }

  export type MarcaMinAggregateInputType = {
    id?: true
    nombre?: true
  }

  export type MarcaMaxAggregateInputType = {
    id?: true
    nombre?: true
  }

  export type MarcaCountAggregateInputType = {
    id?: true
    nombre?: true
    _all?: true
  }

  export type MarcaAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Marca to aggregate.
     */
    where?: MarcaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Marcas to fetch.
     */
    orderBy?: MarcaOrderByWithRelationInput | MarcaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MarcaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Marcas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Marcas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Marcas
    **/
    _count?: true | MarcaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MarcaAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MarcaSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MarcaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MarcaMaxAggregateInputType
  }

  export type GetMarcaAggregateType<T extends MarcaAggregateArgs> = {
        [P in keyof T & keyof AggregateMarca]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMarca[P]>
      : GetScalarType<T[P], AggregateMarca[P]>
  }




  export type MarcaGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MarcaWhereInput
    orderBy?: MarcaOrderByWithAggregationInput | MarcaOrderByWithAggregationInput[]
    by: MarcaScalarFieldEnum[] | MarcaScalarFieldEnum
    having?: MarcaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MarcaCountAggregateInputType | true
    _avg?: MarcaAvgAggregateInputType
    _sum?: MarcaSumAggregateInputType
    _min?: MarcaMinAggregateInputType
    _max?: MarcaMaxAggregateInputType
  }

  export type MarcaGroupByOutputType = {
    id: number
    nombre: string
    _count: MarcaCountAggregateOutputType | null
    _avg: MarcaAvgAggregateOutputType | null
    _sum: MarcaSumAggregateOutputType | null
    _min: MarcaMinAggregateOutputType | null
    _max: MarcaMaxAggregateOutputType | null
  }

  type GetMarcaGroupByPayload<T extends MarcaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MarcaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MarcaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MarcaGroupByOutputType[P]>
            : GetScalarType<T[P], MarcaGroupByOutputType[P]>
        }
      >
    >


  export type MarcaSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    productos?: boolean | Marca$productosArgs<ExtArgs>
    _count?: boolean | MarcaCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["marca"]>

  export type MarcaSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
  }, ExtArgs["result"]["marca"]>

  export type MarcaSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
  }, ExtArgs["result"]["marca"]>

  export type MarcaSelectScalar = {
    id?: boolean
    nombre?: boolean
  }

  export type MarcaOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "nombre", ExtArgs["result"]["marca"]>
  export type MarcaInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    productos?: boolean | Marca$productosArgs<ExtArgs>
    _count?: boolean | MarcaCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type MarcaIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type MarcaIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $MarcaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Marca"
    objects: {
      productos: Prisma.$ProductoPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      nombre: string
    }, ExtArgs["result"]["marca"]>
    composites: {}
  }

  type MarcaGetPayload<S extends boolean | null | undefined | MarcaDefaultArgs> = $Result.GetResult<Prisma.$MarcaPayload, S>

  type MarcaCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MarcaFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MarcaCountAggregateInputType | true
    }

  export interface MarcaDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Marca'], meta: { name: 'Marca' } }
    /**
     * Find zero or one Marca that matches the filter.
     * @param {MarcaFindUniqueArgs} args - Arguments to find a Marca
     * @example
     * // Get one Marca
     * const marca = await prisma.marca.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MarcaFindUniqueArgs>(args: SelectSubset<T, MarcaFindUniqueArgs<ExtArgs>>): Prisma__MarcaClient<$Result.GetResult<Prisma.$MarcaPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Marca that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MarcaFindUniqueOrThrowArgs} args - Arguments to find a Marca
     * @example
     * // Get one Marca
     * const marca = await prisma.marca.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MarcaFindUniqueOrThrowArgs>(args: SelectSubset<T, MarcaFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MarcaClient<$Result.GetResult<Prisma.$MarcaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Marca that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MarcaFindFirstArgs} args - Arguments to find a Marca
     * @example
     * // Get one Marca
     * const marca = await prisma.marca.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MarcaFindFirstArgs>(args?: SelectSubset<T, MarcaFindFirstArgs<ExtArgs>>): Prisma__MarcaClient<$Result.GetResult<Prisma.$MarcaPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Marca that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MarcaFindFirstOrThrowArgs} args - Arguments to find a Marca
     * @example
     * // Get one Marca
     * const marca = await prisma.marca.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MarcaFindFirstOrThrowArgs>(args?: SelectSubset<T, MarcaFindFirstOrThrowArgs<ExtArgs>>): Prisma__MarcaClient<$Result.GetResult<Prisma.$MarcaPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Marcas that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MarcaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Marcas
     * const marcas = await prisma.marca.findMany()
     * 
     * // Get first 10 Marcas
     * const marcas = await prisma.marca.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const marcaWithIdOnly = await prisma.marca.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MarcaFindManyArgs>(args?: SelectSubset<T, MarcaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MarcaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Marca.
     * @param {MarcaCreateArgs} args - Arguments to create a Marca.
     * @example
     * // Create one Marca
     * const Marca = await prisma.marca.create({
     *   data: {
     *     // ... data to create a Marca
     *   }
     * })
     * 
     */
    create<T extends MarcaCreateArgs>(args: SelectSubset<T, MarcaCreateArgs<ExtArgs>>): Prisma__MarcaClient<$Result.GetResult<Prisma.$MarcaPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Marcas.
     * @param {MarcaCreateManyArgs} args - Arguments to create many Marcas.
     * @example
     * // Create many Marcas
     * const marca = await prisma.marca.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MarcaCreateManyArgs>(args?: SelectSubset<T, MarcaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Marcas and returns the data saved in the database.
     * @param {MarcaCreateManyAndReturnArgs} args - Arguments to create many Marcas.
     * @example
     * // Create many Marcas
     * const marca = await prisma.marca.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Marcas and only return the `id`
     * const marcaWithIdOnly = await prisma.marca.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MarcaCreateManyAndReturnArgs>(args?: SelectSubset<T, MarcaCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MarcaPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Marca.
     * @param {MarcaDeleteArgs} args - Arguments to delete one Marca.
     * @example
     * // Delete one Marca
     * const Marca = await prisma.marca.delete({
     *   where: {
     *     // ... filter to delete one Marca
     *   }
     * })
     * 
     */
    delete<T extends MarcaDeleteArgs>(args: SelectSubset<T, MarcaDeleteArgs<ExtArgs>>): Prisma__MarcaClient<$Result.GetResult<Prisma.$MarcaPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Marca.
     * @param {MarcaUpdateArgs} args - Arguments to update one Marca.
     * @example
     * // Update one Marca
     * const marca = await prisma.marca.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MarcaUpdateArgs>(args: SelectSubset<T, MarcaUpdateArgs<ExtArgs>>): Prisma__MarcaClient<$Result.GetResult<Prisma.$MarcaPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Marcas.
     * @param {MarcaDeleteManyArgs} args - Arguments to filter Marcas to delete.
     * @example
     * // Delete a few Marcas
     * const { count } = await prisma.marca.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MarcaDeleteManyArgs>(args?: SelectSubset<T, MarcaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Marcas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MarcaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Marcas
     * const marca = await prisma.marca.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MarcaUpdateManyArgs>(args: SelectSubset<T, MarcaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Marcas and returns the data updated in the database.
     * @param {MarcaUpdateManyAndReturnArgs} args - Arguments to update many Marcas.
     * @example
     * // Update many Marcas
     * const marca = await prisma.marca.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Marcas and only return the `id`
     * const marcaWithIdOnly = await prisma.marca.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MarcaUpdateManyAndReturnArgs>(args: SelectSubset<T, MarcaUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MarcaPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Marca.
     * @param {MarcaUpsertArgs} args - Arguments to update or create a Marca.
     * @example
     * // Update or create a Marca
     * const marca = await prisma.marca.upsert({
     *   create: {
     *     // ... data to create a Marca
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Marca we want to update
     *   }
     * })
     */
    upsert<T extends MarcaUpsertArgs>(args: SelectSubset<T, MarcaUpsertArgs<ExtArgs>>): Prisma__MarcaClient<$Result.GetResult<Prisma.$MarcaPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Marcas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MarcaCountArgs} args - Arguments to filter Marcas to count.
     * @example
     * // Count the number of Marcas
     * const count = await prisma.marca.count({
     *   where: {
     *     // ... the filter for the Marcas we want to count
     *   }
     * })
    **/
    count<T extends MarcaCountArgs>(
      args?: Subset<T, MarcaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MarcaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Marca.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MarcaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MarcaAggregateArgs>(args: Subset<T, MarcaAggregateArgs>): Prisma.PrismaPromise<GetMarcaAggregateType<T>>

    /**
     * Group by Marca.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MarcaGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MarcaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MarcaGroupByArgs['orderBy'] }
        : { orderBy?: MarcaGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MarcaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMarcaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Marca model
   */
  readonly fields: MarcaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Marca.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MarcaClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    productos<T extends Marca$productosArgs<ExtArgs> = {}>(args?: Subset<T, Marca$productosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Marca model
   */
  interface MarcaFieldRefs {
    readonly id: FieldRef<"Marca", 'Int'>
    readonly nombre: FieldRef<"Marca", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Marca findUnique
   */
  export type MarcaFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Marca
     */
    select?: MarcaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Marca
     */
    omit?: MarcaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MarcaInclude<ExtArgs> | null
    /**
     * Filter, which Marca to fetch.
     */
    where: MarcaWhereUniqueInput
  }

  /**
   * Marca findUniqueOrThrow
   */
  export type MarcaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Marca
     */
    select?: MarcaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Marca
     */
    omit?: MarcaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MarcaInclude<ExtArgs> | null
    /**
     * Filter, which Marca to fetch.
     */
    where: MarcaWhereUniqueInput
  }

  /**
   * Marca findFirst
   */
  export type MarcaFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Marca
     */
    select?: MarcaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Marca
     */
    omit?: MarcaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MarcaInclude<ExtArgs> | null
    /**
     * Filter, which Marca to fetch.
     */
    where?: MarcaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Marcas to fetch.
     */
    orderBy?: MarcaOrderByWithRelationInput | MarcaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Marcas.
     */
    cursor?: MarcaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Marcas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Marcas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Marcas.
     */
    distinct?: MarcaScalarFieldEnum | MarcaScalarFieldEnum[]
  }

  /**
   * Marca findFirstOrThrow
   */
  export type MarcaFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Marca
     */
    select?: MarcaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Marca
     */
    omit?: MarcaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MarcaInclude<ExtArgs> | null
    /**
     * Filter, which Marca to fetch.
     */
    where?: MarcaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Marcas to fetch.
     */
    orderBy?: MarcaOrderByWithRelationInput | MarcaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Marcas.
     */
    cursor?: MarcaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Marcas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Marcas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Marcas.
     */
    distinct?: MarcaScalarFieldEnum | MarcaScalarFieldEnum[]
  }

  /**
   * Marca findMany
   */
  export type MarcaFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Marca
     */
    select?: MarcaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Marca
     */
    omit?: MarcaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MarcaInclude<ExtArgs> | null
    /**
     * Filter, which Marcas to fetch.
     */
    where?: MarcaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Marcas to fetch.
     */
    orderBy?: MarcaOrderByWithRelationInput | MarcaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Marcas.
     */
    cursor?: MarcaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Marcas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Marcas.
     */
    skip?: number
    distinct?: MarcaScalarFieldEnum | MarcaScalarFieldEnum[]
  }

  /**
   * Marca create
   */
  export type MarcaCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Marca
     */
    select?: MarcaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Marca
     */
    omit?: MarcaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MarcaInclude<ExtArgs> | null
    /**
     * The data needed to create a Marca.
     */
    data: XOR<MarcaCreateInput, MarcaUncheckedCreateInput>
  }

  /**
   * Marca createMany
   */
  export type MarcaCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Marcas.
     */
    data: MarcaCreateManyInput | MarcaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Marca createManyAndReturn
   */
  export type MarcaCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Marca
     */
    select?: MarcaSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Marca
     */
    omit?: MarcaOmit<ExtArgs> | null
    /**
     * The data used to create many Marcas.
     */
    data: MarcaCreateManyInput | MarcaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Marca update
   */
  export type MarcaUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Marca
     */
    select?: MarcaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Marca
     */
    omit?: MarcaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MarcaInclude<ExtArgs> | null
    /**
     * The data needed to update a Marca.
     */
    data: XOR<MarcaUpdateInput, MarcaUncheckedUpdateInput>
    /**
     * Choose, which Marca to update.
     */
    where: MarcaWhereUniqueInput
  }

  /**
   * Marca updateMany
   */
  export type MarcaUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Marcas.
     */
    data: XOR<MarcaUpdateManyMutationInput, MarcaUncheckedUpdateManyInput>
    /**
     * Filter which Marcas to update
     */
    where?: MarcaWhereInput
    /**
     * Limit how many Marcas to update.
     */
    limit?: number
  }

  /**
   * Marca updateManyAndReturn
   */
  export type MarcaUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Marca
     */
    select?: MarcaSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Marca
     */
    omit?: MarcaOmit<ExtArgs> | null
    /**
     * The data used to update Marcas.
     */
    data: XOR<MarcaUpdateManyMutationInput, MarcaUncheckedUpdateManyInput>
    /**
     * Filter which Marcas to update
     */
    where?: MarcaWhereInput
    /**
     * Limit how many Marcas to update.
     */
    limit?: number
  }

  /**
   * Marca upsert
   */
  export type MarcaUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Marca
     */
    select?: MarcaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Marca
     */
    omit?: MarcaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MarcaInclude<ExtArgs> | null
    /**
     * The filter to search for the Marca to update in case it exists.
     */
    where: MarcaWhereUniqueInput
    /**
     * In case the Marca found by the `where` argument doesn't exist, create a new Marca with this data.
     */
    create: XOR<MarcaCreateInput, MarcaUncheckedCreateInput>
    /**
     * In case the Marca was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MarcaUpdateInput, MarcaUncheckedUpdateInput>
  }

  /**
   * Marca delete
   */
  export type MarcaDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Marca
     */
    select?: MarcaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Marca
     */
    omit?: MarcaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MarcaInclude<ExtArgs> | null
    /**
     * Filter which Marca to delete.
     */
    where: MarcaWhereUniqueInput
  }

  /**
   * Marca deleteMany
   */
  export type MarcaDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Marcas to delete
     */
    where?: MarcaWhereInput
    /**
     * Limit how many Marcas to delete.
     */
    limit?: number
  }

  /**
   * Marca.productos
   */
  export type Marca$productosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Producto
     */
    select?: ProductoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Producto
     */
    omit?: ProductoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductoInclude<ExtArgs> | null
    where?: ProductoWhereInput
    orderBy?: ProductoOrderByWithRelationInput | ProductoOrderByWithRelationInput[]
    cursor?: ProductoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProductoScalarFieldEnum | ProductoScalarFieldEnum[]
  }

  /**
   * Marca without action
   */
  export type MarcaDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Marca
     */
    select?: MarcaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Marca
     */
    omit?: MarcaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MarcaInclude<ExtArgs> | null
  }


  /**
   * Model Producto
   */

  export type AggregateProducto = {
    _count: ProductoCountAggregateOutputType | null
    _avg: ProductoAvgAggregateOutputType | null
    _sum: ProductoSumAggregateOutputType | null
    _min: ProductoMinAggregateOutputType | null
    _max: ProductoMaxAggregateOutputType | null
  }

  export type ProductoAvgAggregateOutputType = {
    id: number | null
    rubroId: number | null
    marcaId: number | null
    unidadId: number | null
    precioCompra: number | null
    precioVenta: number | null
  }

  export type ProductoSumAggregateOutputType = {
    id: number | null
    rubroId: number | null
    marcaId: number | null
    unidadId: number | null
    precioCompra: number | null
    precioVenta: number | null
  }

  export type ProductoMinAggregateOutputType = {
    id: number | null
    nombre: string | null
    descripcion: string | null
    rubroId: number | null
    marcaId: number | null
    unidadId: number | null
    precioCompra: number | null
    precioVenta: number | null
    estado: boolean | null
  }

  export type ProductoMaxAggregateOutputType = {
    id: number | null
    nombre: string | null
    descripcion: string | null
    rubroId: number | null
    marcaId: number | null
    unidadId: number | null
    precioCompra: number | null
    precioVenta: number | null
    estado: boolean | null
  }

  export type ProductoCountAggregateOutputType = {
    id: number
    nombre: number
    descripcion: number
    rubroId: number
    marcaId: number
    unidadId: number
    precioCompra: number
    precioVenta: number
    estado: number
    _all: number
  }


  export type ProductoAvgAggregateInputType = {
    id?: true
    rubroId?: true
    marcaId?: true
    unidadId?: true
    precioCompra?: true
    precioVenta?: true
  }

  export type ProductoSumAggregateInputType = {
    id?: true
    rubroId?: true
    marcaId?: true
    unidadId?: true
    precioCompra?: true
    precioVenta?: true
  }

  export type ProductoMinAggregateInputType = {
    id?: true
    nombre?: true
    descripcion?: true
    rubroId?: true
    marcaId?: true
    unidadId?: true
    precioCompra?: true
    precioVenta?: true
    estado?: true
  }

  export type ProductoMaxAggregateInputType = {
    id?: true
    nombre?: true
    descripcion?: true
    rubroId?: true
    marcaId?: true
    unidadId?: true
    precioCompra?: true
    precioVenta?: true
    estado?: true
  }

  export type ProductoCountAggregateInputType = {
    id?: true
    nombre?: true
    descripcion?: true
    rubroId?: true
    marcaId?: true
    unidadId?: true
    precioCompra?: true
    precioVenta?: true
    estado?: true
    _all?: true
  }

  export type ProductoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Producto to aggregate.
     */
    where?: ProductoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Productos to fetch.
     */
    orderBy?: ProductoOrderByWithRelationInput | ProductoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProductoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Productos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Productos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Productos
    **/
    _count?: true | ProductoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProductoAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProductoSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProductoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProductoMaxAggregateInputType
  }

  export type GetProductoAggregateType<T extends ProductoAggregateArgs> = {
        [P in keyof T & keyof AggregateProducto]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProducto[P]>
      : GetScalarType<T[P], AggregateProducto[P]>
  }




  export type ProductoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductoWhereInput
    orderBy?: ProductoOrderByWithAggregationInput | ProductoOrderByWithAggregationInput[]
    by: ProductoScalarFieldEnum[] | ProductoScalarFieldEnum
    having?: ProductoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProductoCountAggregateInputType | true
    _avg?: ProductoAvgAggregateInputType
    _sum?: ProductoSumAggregateInputType
    _min?: ProductoMinAggregateInputType
    _max?: ProductoMaxAggregateInputType
  }

  export type ProductoGroupByOutputType = {
    id: number
    nombre: string
    descripcion: string | null
    rubroId: number
    marcaId: number
    unidadId: number
    precioCompra: number
    precioVenta: number
    estado: boolean
    _count: ProductoCountAggregateOutputType | null
    _avg: ProductoAvgAggregateOutputType | null
    _sum: ProductoSumAggregateOutputType | null
    _min: ProductoMinAggregateOutputType | null
    _max: ProductoMaxAggregateOutputType | null
  }

  type GetProductoGroupByPayload<T extends ProductoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProductoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProductoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProductoGroupByOutputType[P]>
            : GetScalarType<T[P], ProductoGroupByOutputType[P]>
        }
      >
    >


  export type ProductoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    descripcion?: boolean
    rubroId?: boolean
    marcaId?: boolean
    unidadId?: boolean
    precioCompra?: boolean
    precioVenta?: boolean
    estado?: boolean
    marca?: boolean | MarcaDefaultArgs<ExtArgs>
    rubro?: boolean | RubroDefaultArgs<ExtArgs>
    unidad?: boolean | UnidadDefaultArgs<ExtArgs>
    stockProductos?: boolean | Producto$stockProductosArgs<ExtArgs>
    _count?: boolean | ProductoCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["producto"]>

  export type ProductoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    descripcion?: boolean
    rubroId?: boolean
    marcaId?: boolean
    unidadId?: boolean
    precioCompra?: boolean
    precioVenta?: boolean
    estado?: boolean
    marca?: boolean | MarcaDefaultArgs<ExtArgs>
    rubro?: boolean | RubroDefaultArgs<ExtArgs>
    unidad?: boolean | UnidadDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["producto"]>

  export type ProductoSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    descripcion?: boolean
    rubroId?: boolean
    marcaId?: boolean
    unidadId?: boolean
    precioCompra?: boolean
    precioVenta?: boolean
    estado?: boolean
    marca?: boolean | MarcaDefaultArgs<ExtArgs>
    rubro?: boolean | RubroDefaultArgs<ExtArgs>
    unidad?: boolean | UnidadDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["producto"]>

  export type ProductoSelectScalar = {
    id?: boolean
    nombre?: boolean
    descripcion?: boolean
    rubroId?: boolean
    marcaId?: boolean
    unidadId?: boolean
    precioCompra?: boolean
    precioVenta?: boolean
    estado?: boolean
  }

  export type ProductoOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "nombre" | "descripcion" | "rubroId" | "marcaId" | "unidadId" | "precioCompra" | "precioVenta" | "estado", ExtArgs["result"]["producto"]>
  export type ProductoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    marca?: boolean | MarcaDefaultArgs<ExtArgs>
    rubro?: boolean | RubroDefaultArgs<ExtArgs>
    unidad?: boolean | UnidadDefaultArgs<ExtArgs>
    stockProductos?: boolean | Producto$stockProductosArgs<ExtArgs>
    _count?: boolean | ProductoCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ProductoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    marca?: boolean | MarcaDefaultArgs<ExtArgs>
    rubro?: boolean | RubroDefaultArgs<ExtArgs>
    unidad?: boolean | UnidadDefaultArgs<ExtArgs>
  }
  export type ProductoIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    marca?: boolean | MarcaDefaultArgs<ExtArgs>
    rubro?: boolean | RubroDefaultArgs<ExtArgs>
    unidad?: boolean | UnidadDefaultArgs<ExtArgs>
  }

  export type $ProductoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Producto"
    objects: {
      marca: Prisma.$MarcaPayload<ExtArgs>
      rubro: Prisma.$RubroPayload<ExtArgs>
      unidad: Prisma.$UnidadPayload<ExtArgs>
      stockProductos: Prisma.$StockPorDepositoPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      nombre: string
      descripcion: string | null
      rubroId: number
      marcaId: number
      unidadId: number
      precioCompra: number
      precioVenta: number
      estado: boolean
    }, ExtArgs["result"]["producto"]>
    composites: {}
  }

  type ProductoGetPayload<S extends boolean | null | undefined | ProductoDefaultArgs> = $Result.GetResult<Prisma.$ProductoPayload, S>

  type ProductoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProductoFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProductoCountAggregateInputType | true
    }

  export interface ProductoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Producto'], meta: { name: 'Producto' } }
    /**
     * Find zero or one Producto that matches the filter.
     * @param {ProductoFindUniqueArgs} args - Arguments to find a Producto
     * @example
     * // Get one Producto
     * const producto = await prisma.producto.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProductoFindUniqueArgs>(args: SelectSubset<T, ProductoFindUniqueArgs<ExtArgs>>): Prisma__ProductoClient<$Result.GetResult<Prisma.$ProductoPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Producto that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProductoFindUniqueOrThrowArgs} args - Arguments to find a Producto
     * @example
     * // Get one Producto
     * const producto = await prisma.producto.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProductoFindUniqueOrThrowArgs>(args: SelectSubset<T, ProductoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProductoClient<$Result.GetResult<Prisma.$ProductoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Producto that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductoFindFirstArgs} args - Arguments to find a Producto
     * @example
     * // Get one Producto
     * const producto = await prisma.producto.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProductoFindFirstArgs>(args?: SelectSubset<T, ProductoFindFirstArgs<ExtArgs>>): Prisma__ProductoClient<$Result.GetResult<Prisma.$ProductoPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Producto that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductoFindFirstOrThrowArgs} args - Arguments to find a Producto
     * @example
     * // Get one Producto
     * const producto = await prisma.producto.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProductoFindFirstOrThrowArgs>(args?: SelectSubset<T, ProductoFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProductoClient<$Result.GetResult<Prisma.$ProductoPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Productos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Productos
     * const productos = await prisma.producto.findMany()
     * 
     * // Get first 10 Productos
     * const productos = await prisma.producto.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const productoWithIdOnly = await prisma.producto.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProductoFindManyArgs>(args?: SelectSubset<T, ProductoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Producto.
     * @param {ProductoCreateArgs} args - Arguments to create a Producto.
     * @example
     * // Create one Producto
     * const Producto = await prisma.producto.create({
     *   data: {
     *     // ... data to create a Producto
     *   }
     * })
     * 
     */
    create<T extends ProductoCreateArgs>(args: SelectSubset<T, ProductoCreateArgs<ExtArgs>>): Prisma__ProductoClient<$Result.GetResult<Prisma.$ProductoPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Productos.
     * @param {ProductoCreateManyArgs} args - Arguments to create many Productos.
     * @example
     * // Create many Productos
     * const producto = await prisma.producto.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProductoCreateManyArgs>(args?: SelectSubset<T, ProductoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Productos and returns the data saved in the database.
     * @param {ProductoCreateManyAndReturnArgs} args - Arguments to create many Productos.
     * @example
     * // Create many Productos
     * const producto = await prisma.producto.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Productos and only return the `id`
     * const productoWithIdOnly = await prisma.producto.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProductoCreateManyAndReturnArgs>(args?: SelectSubset<T, ProductoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductoPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Producto.
     * @param {ProductoDeleteArgs} args - Arguments to delete one Producto.
     * @example
     * // Delete one Producto
     * const Producto = await prisma.producto.delete({
     *   where: {
     *     // ... filter to delete one Producto
     *   }
     * })
     * 
     */
    delete<T extends ProductoDeleteArgs>(args: SelectSubset<T, ProductoDeleteArgs<ExtArgs>>): Prisma__ProductoClient<$Result.GetResult<Prisma.$ProductoPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Producto.
     * @param {ProductoUpdateArgs} args - Arguments to update one Producto.
     * @example
     * // Update one Producto
     * const producto = await prisma.producto.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProductoUpdateArgs>(args: SelectSubset<T, ProductoUpdateArgs<ExtArgs>>): Prisma__ProductoClient<$Result.GetResult<Prisma.$ProductoPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Productos.
     * @param {ProductoDeleteManyArgs} args - Arguments to filter Productos to delete.
     * @example
     * // Delete a few Productos
     * const { count } = await prisma.producto.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProductoDeleteManyArgs>(args?: SelectSubset<T, ProductoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Productos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Productos
     * const producto = await prisma.producto.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProductoUpdateManyArgs>(args: SelectSubset<T, ProductoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Productos and returns the data updated in the database.
     * @param {ProductoUpdateManyAndReturnArgs} args - Arguments to update many Productos.
     * @example
     * // Update many Productos
     * const producto = await prisma.producto.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Productos and only return the `id`
     * const productoWithIdOnly = await prisma.producto.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ProductoUpdateManyAndReturnArgs>(args: SelectSubset<T, ProductoUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductoPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Producto.
     * @param {ProductoUpsertArgs} args - Arguments to update or create a Producto.
     * @example
     * // Update or create a Producto
     * const producto = await prisma.producto.upsert({
     *   create: {
     *     // ... data to create a Producto
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Producto we want to update
     *   }
     * })
     */
    upsert<T extends ProductoUpsertArgs>(args: SelectSubset<T, ProductoUpsertArgs<ExtArgs>>): Prisma__ProductoClient<$Result.GetResult<Prisma.$ProductoPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Productos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductoCountArgs} args - Arguments to filter Productos to count.
     * @example
     * // Count the number of Productos
     * const count = await prisma.producto.count({
     *   where: {
     *     // ... the filter for the Productos we want to count
     *   }
     * })
    **/
    count<T extends ProductoCountArgs>(
      args?: Subset<T, ProductoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProductoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Producto.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProductoAggregateArgs>(args: Subset<T, ProductoAggregateArgs>): Prisma.PrismaPromise<GetProductoAggregateType<T>>

    /**
     * Group by Producto.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProductoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProductoGroupByArgs['orderBy'] }
        : { orderBy?: ProductoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProductoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProductoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Producto model
   */
  readonly fields: ProductoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Producto.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProductoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    marca<T extends MarcaDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MarcaDefaultArgs<ExtArgs>>): Prisma__MarcaClient<$Result.GetResult<Prisma.$MarcaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    rubro<T extends RubroDefaultArgs<ExtArgs> = {}>(args?: Subset<T, RubroDefaultArgs<ExtArgs>>): Prisma__RubroClient<$Result.GetResult<Prisma.$RubroPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    unidad<T extends UnidadDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UnidadDefaultArgs<ExtArgs>>): Prisma__UnidadClient<$Result.GetResult<Prisma.$UnidadPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    stockProductos<T extends Producto$stockProductosArgs<ExtArgs> = {}>(args?: Subset<T, Producto$stockProductosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StockPorDepositoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Producto model
   */
  interface ProductoFieldRefs {
    readonly id: FieldRef<"Producto", 'Int'>
    readonly nombre: FieldRef<"Producto", 'String'>
    readonly descripcion: FieldRef<"Producto", 'String'>
    readonly rubroId: FieldRef<"Producto", 'Int'>
    readonly marcaId: FieldRef<"Producto", 'Int'>
    readonly unidadId: FieldRef<"Producto", 'Int'>
    readonly precioCompra: FieldRef<"Producto", 'Float'>
    readonly precioVenta: FieldRef<"Producto", 'Float'>
    readonly estado: FieldRef<"Producto", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * Producto findUnique
   */
  export type ProductoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Producto
     */
    select?: ProductoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Producto
     */
    omit?: ProductoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductoInclude<ExtArgs> | null
    /**
     * Filter, which Producto to fetch.
     */
    where: ProductoWhereUniqueInput
  }

  /**
   * Producto findUniqueOrThrow
   */
  export type ProductoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Producto
     */
    select?: ProductoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Producto
     */
    omit?: ProductoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductoInclude<ExtArgs> | null
    /**
     * Filter, which Producto to fetch.
     */
    where: ProductoWhereUniqueInput
  }

  /**
   * Producto findFirst
   */
  export type ProductoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Producto
     */
    select?: ProductoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Producto
     */
    omit?: ProductoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductoInclude<ExtArgs> | null
    /**
     * Filter, which Producto to fetch.
     */
    where?: ProductoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Productos to fetch.
     */
    orderBy?: ProductoOrderByWithRelationInput | ProductoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Productos.
     */
    cursor?: ProductoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Productos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Productos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Productos.
     */
    distinct?: ProductoScalarFieldEnum | ProductoScalarFieldEnum[]
  }

  /**
   * Producto findFirstOrThrow
   */
  export type ProductoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Producto
     */
    select?: ProductoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Producto
     */
    omit?: ProductoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductoInclude<ExtArgs> | null
    /**
     * Filter, which Producto to fetch.
     */
    where?: ProductoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Productos to fetch.
     */
    orderBy?: ProductoOrderByWithRelationInput | ProductoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Productos.
     */
    cursor?: ProductoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Productos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Productos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Productos.
     */
    distinct?: ProductoScalarFieldEnum | ProductoScalarFieldEnum[]
  }

  /**
   * Producto findMany
   */
  export type ProductoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Producto
     */
    select?: ProductoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Producto
     */
    omit?: ProductoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductoInclude<ExtArgs> | null
    /**
     * Filter, which Productos to fetch.
     */
    where?: ProductoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Productos to fetch.
     */
    orderBy?: ProductoOrderByWithRelationInput | ProductoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Productos.
     */
    cursor?: ProductoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Productos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Productos.
     */
    skip?: number
    distinct?: ProductoScalarFieldEnum | ProductoScalarFieldEnum[]
  }

  /**
   * Producto create
   */
  export type ProductoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Producto
     */
    select?: ProductoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Producto
     */
    omit?: ProductoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductoInclude<ExtArgs> | null
    /**
     * The data needed to create a Producto.
     */
    data: XOR<ProductoCreateInput, ProductoUncheckedCreateInput>
  }

  /**
   * Producto createMany
   */
  export type ProductoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Productos.
     */
    data: ProductoCreateManyInput | ProductoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Producto createManyAndReturn
   */
  export type ProductoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Producto
     */
    select?: ProductoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Producto
     */
    omit?: ProductoOmit<ExtArgs> | null
    /**
     * The data used to create many Productos.
     */
    data: ProductoCreateManyInput | ProductoCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductoIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Producto update
   */
  export type ProductoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Producto
     */
    select?: ProductoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Producto
     */
    omit?: ProductoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductoInclude<ExtArgs> | null
    /**
     * The data needed to update a Producto.
     */
    data: XOR<ProductoUpdateInput, ProductoUncheckedUpdateInput>
    /**
     * Choose, which Producto to update.
     */
    where: ProductoWhereUniqueInput
  }

  /**
   * Producto updateMany
   */
  export type ProductoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Productos.
     */
    data: XOR<ProductoUpdateManyMutationInput, ProductoUncheckedUpdateManyInput>
    /**
     * Filter which Productos to update
     */
    where?: ProductoWhereInput
    /**
     * Limit how many Productos to update.
     */
    limit?: number
  }

  /**
   * Producto updateManyAndReturn
   */
  export type ProductoUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Producto
     */
    select?: ProductoSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Producto
     */
    omit?: ProductoOmit<ExtArgs> | null
    /**
     * The data used to update Productos.
     */
    data: XOR<ProductoUpdateManyMutationInput, ProductoUncheckedUpdateManyInput>
    /**
     * Filter which Productos to update
     */
    where?: ProductoWhereInput
    /**
     * Limit how many Productos to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductoIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Producto upsert
   */
  export type ProductoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Producto
     */
    select?: ProductoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Producto
     */
    omit?: ProductoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductoInclude<ExtArgs> | null
    /**
     * The filter to search for the Producto to update in case it exists.
     */
    where: ProductoWhereUniqueInput
    /**
     * In case the Producto found by the `where` argument doesn't exist, create a new Producto with this data.
     */
    create: XOR<ProductoCreateInput, ProductoUncheckedCreateInput>
    /**
     * In case the Producto was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProductoUpdateInput, ProductoUncheckedUpdateInput>
  }

  /**
   * Producto delete
   */
  export type ProductoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Producto
     */
    select?: ProductoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Producto
     */
    omit?: ProductoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductoInclude<ExtArgs> | null
    /**
     * Filter which Producto to delete.
     */
    where: ProductoWhereUniqueInput
  }

  /**
   * Producto deleteMany
   */
  export type ProductoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Productos to delete
     */
    where?: ProductoWhereInput
    /**
     * Limit how many Productos to delete.
     */
    limit?: number
  }

  /**
   * Producto.stockProductos
   */
  export type Producto$stockProductosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockPorDeposito
     */
    select?: StockPorDepositoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockPorDeposito
     */
    omit?: StockPorDepositoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockPorDepositoInclude<ExtArgs> | null
    where?: StockPorDepositoWhereInput
    orderBy?: StockPorDepositoOrderByWithRelationInput | StockPorDepositoOrderByWithRelationInput[]
    cursor?: StockPorDepositoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: StockPorDepositoScalarFieldEnum | StockPorDepositoScalarFieldEnum[]
  }

  /**
   * Producto without action
   */
  export type ProductoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Producto
     */
    select?: ProductoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Producto
     */
    omit?: ProductoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductoInclude<ExtArgs> | null
  }


  /**
   * Model Deposito
   */

  export type AggregateDeposito = {
    _count: DepositoCountAggregateOutputType | null
    _avg: DepositoAvgAggregateOutputType | null
    _sum: DepositoSumAggregateOutputType | null
    _min: DepositoMinAggregateOutputType | null
    _max: DepositoMaxAggregateOutputType | null
  }

  export type DepositoAvgAggregateOutputType = {
    id: number | null
    capacidad: number | null
  }

  export type DepositoSumAggregateOutputType = {
    id: number | null
    capacidad: number | null
  }

  export type DepositoMinAggregateOutputType = {
    id: number | null
    nombre: string | null
    ubicacion: string | null
    tipo: string | null
    capacidad: number | null
    estado: boolean | null
  }

  export type DepositoMaxAggregateOutputType = {
    id: number | null
    nombre: string | null
    ubicacion: string | null
    tipo: string | null
    capacidad: number | null
    estado: boolean | null
  }

  export type DepositoCountAggregateOutputType = {
    id: number
    nombre: number
    ubicacion: number
    tipo: number
    capacidad: number
    estado: number
    _all: number
  }


  export type DepositoAvgAggregateInputType = {
    id?: true
    capacidad?: true
  }

  export type DepositoSumAggregateInputType = {
    id?: true
    capacidad?: true
  }

  export type DepositoMinAggregateInputType = {
    id?: true
    nombre?: true
    ubicacion?: true
    tipo?: true
    capacidad?: true
    estado?: true
  }

  export type DepositoMaxAggregateInputType = {
    id?: true
    nombre?: true
    ubicacion?: true
    tipo?: true
    capacidad?: true
    estado?: true
  }

  export type DepositoCountAggregateInputType = {
    id?: true
    nombre?: true
    ubicacion?: true
    tipo?: true
    capacidad?: true
    estado?: true
    _all?: true
  }

  export type DepositoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Deposito to aggregate.
     */
    where?: DepositoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Depositos to fetch.
     */
    orderBy?: DepositoOrderByWithRelationInput | DepositoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DepositoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Depositos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Depositos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Depositos
    **/
    _count?: true | DepositoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DepositoAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DepositoSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DepositoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DepositoMaxAggregateInputType
  }

  export type GetDepositoAggregateType<T extends DepositoAggregateArgs> = {
        [P in keyof T & keyof AggregateDeposito]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDeposito[P]>
      : GetScalarType<T[P], AggregateDeposito[P]>
  }




  export type DepositoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DepositoWhereInput
    orderBy?: DepositoOrderByWithAggregationInput | DepositoOrderByWithAggregationInput[]
    by: DepositoScalarFieldEnum[] | DepositoScalarFieldEnum
    having?: DepositoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DepositoCountAggregateInputType | true
    _avg?: DepositoAvgAggregateInputType
    _sum?: DepositoSumAggregateInputType
    _min?: DepositoMinAggregateInputType
    _max?: DepositoMaxAggregateInputType
  }

  export type DepositoGroupByOutputType = {
    id: number
    nombre: string
    ubicacion: string
    tipo: string
    capacidad: number | null
    estado: boolean
    _count: DepositoCountAggregateOutputType | null
    _avg: DepositoAvgAggregateOutputType | null
    _sum: DepositoSumAggregateOutputType | null
    _min: DepositoMinAggregateOutputType | null
    _max: DepositoMaxAggregateOutputType | null
  }

  type GetDepositoGroupByPayload<T extends DepositoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DepositoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DepositoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DepositoGroupByOutputType[P]>
            : GetScalarType<T[P], DepositoGroupByOutputType[P]>
        }
      >
    >


  export type DepositoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    ubicacion?: boolean
    tipo?: boolean
    capacidad?: boolean
    estado?: boolean
    movimientos?: boolean | Deposito$movimientosArgs<ExtArgs>
    stock?: boolean | Deposito$stockArgs<ExtArgs>
    _count?: boolean | DepositoCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["deposito"]>

  export type DepositoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    ubicacion?: boolean
    tipo?: boolean
    capacidad?: boolean
    estado?: boolean
  }, ExtArgs["result"]["deposito"]>

  export type DepositoSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    ubicacion?: boolean
    tipo?: boolean
    capacidad?: boolean
    estado?: boolean
  }, ExtArgs["result"]["deposito"]>

  export type DepositoSelectScalar = {
    id?: boolean
    nombre?: boolean
    ubicacion?: boolean
    tipo?: boolean
    capacidad?: boolean
    estado?: boolean
  }

  export type DepositoOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "nombre" | "ubicacion" | "tipo" | "capacidad" | "estado", ExtArgs["result"]["deposito"]>
  export type DepositoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    movimientos?: boolean | Deposito$movimientosArgs<ExtArgs>
    stock?: boolean | Deposito$stockArgs<ExtArgs>
    _count?: boolean | DepositoCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type DepositoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type DepositoIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $DepositoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Deposito"
    objects: {
      movimientos: Prisma.$MovimientoStockPayload<ExtArgs>[]
      stock: Prisma.$StockPorDepositoPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      nombre: string
      ubicacion: string
      tipo: string
      capacidad: number | null
      estado: boolean
    }, ExtArgs["result"]["deposito"]>
    composites: {}
  }

  type DepositoGetPayload<S extends boolean | null | undefined | DepositoDefaultArgs> = $Result.GetResult<Prisma.$DepositoPayload, S>

  type DepositoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DepositoFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DepositoCountAggregateInputType | true
    }

  export interface DepositoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Deposito'], meta: { name: 'Deposito' } }
    /**
     * Find zero or one Deposito that matches the filter.
     * @param {DepositoFindUniqueArgs} args - Arguments to find a Deposito
     * @example
     * // Get one Deposito
     * const deposito = await prisma.deposito.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DepositoFindUniqueArgs>(args: SelectSubset<T, DepositoFindUniqueArgs<ExtArgs>>): Prisma__DepositoClient<$Result.GetResult<Prisma.$DepositoPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Deposito that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DepositoFindUniqueOrThrowArgs} args - Arguments to find a Deposito
     * @example
     * // Get one Deposito
     * const deposito = await prisma.deposito.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DepositoFindUniqueOrThrowArgs>(args: SelectSubset<T, DepositoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DepositoClient<$Result.GetResult<Prisma.$DepositoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Deposito that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepositoFindFirstArgs} args - Arguments to find a Deposito
     * @example
     * // Get one Deposito
     * const deposito = await prisma.deposito.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DepositoFindFirstArgs>(args?: SelectSubset<T, DepositoFindFirstArgs<ExtArgs>>): Prisma__DepositoClient<$Result.GetResult<Prisma.$DepositoPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Deposito that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepositoFindFirstOrThrowArgs} args - Arguments to find a Deposito
     * @example
     * // Get one Deposito
     * const deposito = await prisma.deposito.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DepositoFindFirstOrThrowArgs>(args?: SelectSubset<T, DepositoFindFirstOrThrowArgs<ExtArgs>>): Prisma__DepositoClient<$Result.GetResult<Prisma.$DepositoPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Depositos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepositoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Depositos
     * const depositos = await prisma.deposito.findMany()
     * 
     * // Get first 10 Depositos
     * const depositos = await prisma.deposito.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const depositoWithIdOnly = await prisma.deposito.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DepositoFindManyArgs>(args?: SelectSubset<T, DepositoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DepositoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Deposito.
     * @param {DepositoCreateArgs} args - Arguments to create a Deposito.
     * @example
     * // Create one Deposito
     * const Deposito = await prisma.deposito.create({
     *   data: {
     *     // ... data to create a Deposito
     *   }
     * })
     * 
     */
    create<T extends DepositoCreateArgs>(args: SelectSubset<T, DepositoCreateArgs<ExtArgs>>): Prisma__DepositoClient<$Result.GetResult<Prisma.$DepositoPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Depositos.
     * @param {DepositoCreateManyArgs} args - Arguments to create many Depositos.
     * @example
     * // Create many Depositos
     * const deposito = await prisma.deposito.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DepositoCreateManyArgs>(args?: SelectSubset<T, DepositoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Depositos and returns the data saved in the database.
     * @param {DepositoCreateManyAndReturnArgs} args - Arguments to create many Depositos.
     * @example
     * // Create many Depositos
     * const deposito = await prisma.deposito.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Depositos and only return the `id`
     * const depositoWithIdOnly = await prisma.deposito.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DepositoCreateManyAndReturnArgs>(args?: SelectSubset<T, DepositoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DepositoPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Deposito.
     * @param {DepositoDeleteArgs} args - Arguments to delete one Deposito.
     * @example
     * // Delete one Deposito
     * const Deposito = await prisma.deposito.delete({
     *   where: {
     *     // ... filter to delete one Deposito
     *   }
     * })
     * 
     */
    delete<T extends DepositoDeleteArgs>(args: SelectSubset<T, DepositoDeleteArgs<ExtArgs>>): Prisma__DepositoClient<$Result.GetResult<Prisma.$DepositoPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Deposito.
     * @param {DepositoUpdateArgs} args - Arguments to update one Deposito.
     * @example
     * // Update one Deposito
     * const deposito = await prisma.deposito.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DepositoUpdateArgs>(args: SelectSubset<T, DepositoUpdateArgs<ExtArgs>>): Prisma__DepositoClient<$Result.GetResult<Prisma.$DepositoPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Depositos.
     * @param {DepositoDeleteManyArgs} args - Arguments to filter Depositos to delete.
     * @example
     * // Delete a few Depositos
     * const { count } = await prisma.deposito.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DepositoDeleteManyArgs>(args?: SelectSubset<T, DepositoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Depositos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepositoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Depositos
     * const deposito = await prisma.deposito.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DepositoUpdateManyArgs>(args: SelectSubset<T, DepositoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Depositos and returns the data updated in the database.
     * @param {DepositoUpdateManyAndReturnArgs} args - Arguments to update many Depositos.
     * @example
     * // Update many Depositos
     * const deposito = await prisma.deposito.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Depositos and only return the `id`
     * const depositoWithIdOnly = await prisma.deposito.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends DepositoUpdateManyAndReturnArgs>(args: SelectSubset<T, DepositoUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DepositoPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Deposito.
     * @param {DepositoUpsertArgs} args - Arguments to update or create a Deposito.
     * @example
     * // Update or create a Deposito
     * const deposito = await prisma.deposito.upsert({
     *   create: {
     *     // ... data to create a Deposito
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Deposito we want to update
     *   }
     * })
     */
    upsert<T extends DepositoUpsertArgs>(args: SelectSubset<T, DepositoUpsertArgs<ExtArgs>>): Prisma__DepositoClient<$Result.GetResult<Prisma.$DepositoPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Depositos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepositoCountArgs} args - Arguments to filter Depositos to count.
     * @example
     * // Count the number of Depositos
     * const count = await prisma.deposito.count({
     *   where: {
     *     // ... the filter for the Depositos we want to count
     *   }
     * })
    **/
    count<T extends DepositoCountArgs>(
      args?: Subset<T, DepositoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DepositoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Deposito.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepositoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DepositoAggregateArgs>(args: Subset<T, DepositoAggregateArgs>): Prisma.PrismaPromise<GetDepositoAggregateType<T>>

    /**
     * Group by Deposito.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepositoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DepositoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DepositoGroupByArgs['orderBy'] }
        : { orderBy?: DepositoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DepositoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDepositoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Deposito model
   */
  readonly fields: DepositoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Deposito.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DepositoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    movimientos<T extends Deposito$movimientosArgs<ExtArgs> = {}>(args?: Subset<T, Deposito$movimientosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MovimientoStockPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    stock<T extends Deposito$stockArgs<ExtArgs> = {}>(args?: Subset<T, Deposito$stockArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StockPorDepositoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Deposito model
   */
  interface DepositoFieldRefs {
    readonly id: FieldRef<"Deposito", 'Int'>
    readonly nombre: FieldRef<"Deposito", 'String'>
    readonly ubicacion: FieldRef<"Deposito", 'String'>
    readonly tipo: FieldRef<"Deposito", 'String'>
    readonly capacidad: FieldRef<"Deposito", 'Int'>
    readonly estado: FieldRef<"Deposito", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * Deposito findUnique
   */
  export type DepositoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deposito
     */
    select?: DepositoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Deposito
     */
    omit?: DepositoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepositoInclude<ExtArgs> | null
    /**
     * Filter, which Deposito to fetch.
     */
    where: DepositoWhereUniqueInput
  }

  /**
   * Deposito findUniqueOrThrow
   */
  export type DepositoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deposito
     */
    select?: DepositoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Deposito
     */
    omit?: DepositoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepositoInclude<ExtArgs> | null
    /**
     * Filter, which Deposito to fetch.
     */
    where: DepositoWhereUniqueInput
  }

  /**
   * Deposito findFirst
   */
  export type DepositoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deposito
     */
    select?: DepositoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Deposito
     */
    omit?: DepositoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepositoInclude<ExtArgs> | null
    /**
     * Filter, which Deposito to fetch.
     */
    where?: DepositoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Depositos to fetch.
     */
    orderBy?: DepositoOrderByWithRelationInput | DepositoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Depositos.
     */
    cursor?: DepositoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Depositos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Depositos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Depositos.
     */
    distinct?: DepositoScalarFieldEnum | DepositoScalarFieldEnum[]
  }

  /**
   * Deposito findFirstOrThrow
   */
  export type DepositoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deposito
     */
    select?: DepositoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Deposito
     */
    omit?: DepositoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepositoInclude<ExtArgs> | null
    /**
     * Filter, which Deposito to fetch.
     */
    where?: DepositoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Depositos to fetch.
     */
    orderBy?: DepositoOrderByWithRelationInput | DepositoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Depositos.
     */
    cursor?: DepositoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Depositos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Depositos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Depositos.
     */
    distinct?: DepositoScalarFieldEnum | DepositoScalarFieldEnum[]
  }

  /**
   * Deposito findMany
   */
  export type DepositoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deposito
     */
    select?: DepositoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Deposito
     */
    omit?: DepositoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepositoInclude<ExtArgs> | null
    /**
     * Filter, which Depositos to fetch.
     */
    where?: DepositoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Depositos to fetch.
     */
    orderBy?: DepositoOrderByWithRelationInput | DepositoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Depositos.
     */
    cursor?: DepositoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Depositos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Depositos.
     */
    skip?: number
    distinct?: DepositoScalarFieldEnum | DepositoScalarFieldEnum[]
  }

  /**
   * Deposito create
   */
  export type DepositoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deposito
     */
    select?: DepositoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Deposito
     */
    omit?: DepositoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepositoInclude<ExtArgs> | null
    /**
     * The data needed to create a Deposito.
     */
    data: XOR<DepositoCreateInput, DepositoUncheckedCreateInput>
  }

  /**
   * Deposito createMany
   */
  export type DepositoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Depositos.
     */
    data: DepositoCreateManyInput | DepositoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Deposito createManyAndReturn
   */
  export type DepositoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deposito
     */
    select?: DepositoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Deposito
     */
    omit?: DepositoOmit<ExtArgs> | null
    /**
     * The data used to create many Depositos.
     */
    data: DepositoCreateManyInput | DepositoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Deposito update
   */
  export type DepositoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deposito
     */
    select?: DepositoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Deposito
     */
    omit?: DepositoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepositoInclude<ExtArgs> | null
    /**
     * The data needed to update a Deposito.
     */
    data: XOR<DepositoUpdateInput, DepositoUncheckedUpdateInput>
    /**
     * Choose, which Deposito to update.
     */
    where: DepositoWhereUniqueInput
  }

  /**
   * Deposito updateMany
   */
  export type DepositoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Depositos.
     */
    data: XOR<DepositoUpdateManyMutationInput, DepositoUncheckedUpdateManyInput>
    /**
     * Filter which Depositos to update
     */
    where?: DepositoWhereInput
    /**
     * Limit how many Depositos to update.
     */
    limit?: number
  }

  /**
   * Deposito updateManyAndReturn
   */
  export type DepositoUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deposito
     */
    select?: DepositoSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Deposito
     */
    omit?: DepositoOmit<ExtArgs> | null
    /**
     * The data used to update Depositos.
     */
    data: XOR<DepositoUpdateManyMutationInput, DepositoUncheckedUpdateManyInput>
    /**
     * Filter which Depositos to update
     */
    where?: DepositoWhereInput
    /**
     * Limit how many Depositos to update.
     */
    limit?: number
  }

  /**
   * Deposito upsert
   */
  export type DepositoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deposito
     */
    select?: DepositoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Deposito
     */
    omit?: DepositoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepositoInclude<ExtArgs> | null
    /**
     * The filter to search for the Deposito to update in case it exists.
     */
    where: DepositoWhereUniqueInput
    /**
     * In case the Deposito found by the `where` argument doesn't exist, create a new Deposito with this data.
     */
    create: XOR<DepositoCreateInput, DepositoUncheckedCreateInput>
    /**
     * In case the Deposito was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DepositoUpdateInput, DepositoUncheckedUpdateInput>
  }

  /**
   * Deposito delete
   */
  export type DepositoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deposito
     */
    select?: DepositoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Deposito
     */
    omit?: DepositoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepositoInclude<ExtArgs> | null
    /**
     * Filter which Deposito to delete.
     */
    where: DepositoWhereUniqueInput
  }

  /**
   * Deposito deleteMany
   */
  export type DepositoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Depositos to delete
     */
    where?: DepositoWhereInput
    /**
     * Limit how many Depositos to delete.
     */
    limit?: number
  }

  /**
   * Deposito.movimientos
   */
  export type Deposito$movimientosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MovimientoStock
     */
    select?: MovimientoStockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MovimientoStock
     */
    omit?: MovimientoStockOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MovimientoStockInclude<ExtArgs> | null
    where?: MovimientoStockWhereInput
    orderBy?: MovimientoStockOrderByWithRelationInput | MovimientoStockOrderByWithRelationInput[]
    cursor?: MovimientoStockWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MovimientoStockScalarFieldEnum | MovimientoStockScalarFieldEnum[]
  }

  /**
   * Deposito.stock
   */
  export type Deposito$stockArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockPorDeposito
     */
    select?: StockPorDepositoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockPorDeposito
     */
    omit?: StockPorDepositoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockPorDepositoInclude<ExtArgs> | null
    where?: StockPorDepositoWhereInput
    orderBy?: StockPorDepositoOrderByWithRelationInput | StockPorDepositoOrderByWithRelationInput[]
    cursor?: StockPorDepositoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: StockPorDepositoScalarFieldEnum | StockPorDepositoScalarFieldEnum[]
  }

  /**
   * Deposito without action
   */
  export type DepositoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deposito
     */
    select?: DepositoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Deposito
     */
    omit?: DepositoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepositoInclude<ExtArgs> | null
  }


  /**
   * Model StockPorDeposito
   */

  export type AggregateStockPorDeposito = {
    _count: StockPorDepositoCountAggregateOutputType | null
    _avg: StockPorDepositoAvgAggregateOutputType | null
    _sum: StockPorDepositoSumAggregateOutputType | null
    _min: StockPorDepositoMinAggregateOutputType | null
    _max: StockPorDepositoMaxAggregateOutputType | null
  }

  export type StockPorDepositoAvgAggregateOutputType = {
    id: number | null
    productoId: number | null
    depositoId: number | null
    stockActual: number | null
    stockMinimo: number | null
    stockMaximo: number | null
    capacidadMaxima: number | null
  }

  export type StockPorDepositoSumAggregateOutputType = {
    id: number | null
    productoId: number | null
    depositoId: number | null
    stockActual: number | null
    stockMinimo: number | null
    stockMaximo: number | null
    capacidadMaxima: number | null
  }

  export type StockPorDepositoMinAggregateOutputType = {
    id: number | null
    productoId: number | null
    depositoId: number | null
    stockActual: number | null
    stockMinimo: number | null
    stockMaximo: number | null
    capacidadMaxima: number | null
  }

  export type StockPorDepositoMaxAggregateOutputType = {
    id: number | null
    productoId: number | null
    depositoId: number | null
    stockActual: number | null
    stockMinimo: number | null
    stockMaximo: number | null
    capacidadMaxima: number | null
  }

  export type StockPorDepositoCountAggregateOutputType = {
    id: number
    productoId: number
    depositoId: number
    stockActual: number
    stockMinimo: number
    stockMaximo: number
    capacidadMaxima: number
    _all: number
  }


  export type StockPorDepositoAvgAggregateInputType = {
    id?: true
    productoId?: true
    depositoId?: true
    stockActual?: true
    stockMinimo?: true
    stockMaximo?: true
    capacidadMaxima?: true
  }

  export type StockPorDepositoSumAggregateInputType = {
    id?: true
    productoId?: true
    depositoId?: true
    stockActual?: true
    stockMinimo?: true
    stockMaximo?: true
    capacidadMaxima?: true
  }

  export type StockPorDepositoMinAggregateInputType = {
    id?: true
    productoId?: true
    depositoId?: true
    stockActual?: true
    stockMinimo?: true
    stockMaximo?: true
    capacidadMaxima?: true
  }

  export type StockPorDepositoMaxAggregateInputType = {
    id?: true
    productoId?: true
    depositoId?: true
    stockActual?: true
    stockMinimo?: true
    stockMaximo?: true
    capacidadMaxima?: true
  }

  export type StockPorDepositoCountAggregateInputType = {
    id?: true
    productoId?: true
    depositoId?: true
    stockActual?: true
    stockMinimo?: true
    stockMaximo?: true
    capacidadMaxima?: true
    _all?: true
  }

  export type StockPorDepositoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StockPorDeposito to aggregate.
     */
    where?: StockPorDepositoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StockPorDepositos to fetch.
     */
    orderBy?: StockPorDepositoOrderByWithRelationInput | StockPorDepositoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: StockPorDepositoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StockPorDepositos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StockPorDepositos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned StockPorDepositos
    **/
    _count?: true | StockPorDepositoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: StockPorDepositoAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: StockPorDepositoSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: StockPorDepositoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: StockPorDepositoMaxAggregateInputType
  }

  export type GetStockPorDepositoAggregateType<T extends StockPorDepositoAggregateArgs> = {
        [P in keyof T & keyof AggregateStockPorDeposito]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateStockPorDeposito[P]>
      : GetScalarType<T[P], AggregateStockPorDeposito[P]>
  }




  export type StockPorDepositoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StockPorDepositoWhereInput
    orderBy?: StockPorDepositoOrderByWithAggregationInput | StockPorDepositoOrderByWithAggregationInput[]
    by: StockPorDepositoScalarFieldEnum[] | StockPorDepositoScalarFieldEnum
    having?: StockPorDepositoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: StockPorDepositoCountAggregateInputType | true
    _avg?: StockPorDepositoAvgAggregateInputType
    _sum?: StockPorDepositoSumAggregateInputType
    _min?: StockPorDepositoMinAggregateInputType
    _max?: StockPorDepositoMaxAggregateInputType
  }

  export type StockPorDepositoGroupByOutputType = {
    id: number
    productoId: number
    depositoId: number
    stockActual: number
    stockMinimo: number
    stockMaximo: number | null
    capacidadMaxima: number | null
    _count: StockPorDepositoCountAggregateOutputType | null
    _avg: StockPorDepositoAvgAggregateOutputType | null
    _sum: StockPorDepositoSumAggregateOutputType | null
    _min: StockPorDepositoMinAggregateOutputType | null
    _max: StockPorDepositoMaxAggregateOutputType | null
  }

  type GetStockPorDepositoGroupByPayload<T extends StockPorDepositoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<StockPorDepositoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof StockPorDepositoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], StockPorDepositoGroupByOutputType[P]>
            : GetScalarType<T[P], StockPorDepositoGroupByOutputType[P]>
        }
      >
    >


  export type StockPorDepositoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productoId?: boolean
    depositoId?: boolean
    stockActual?: boolean
    stockMinimo?: boolean
    stockMaximo?: boolean
    capacidadMaxima?: boolean
    detallesMovimiento?: boolean | StockPorDeposito$detallesMovimientoArgs<ExtArgs>
    deposito?: boolean | DepositoDefaultArgs<ExtArgs>
    producto?: boolean | ProductoDefaultArgs<ExtArgs>
    _count?: boolean | StockPorDepositoCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["stockPorDeposito"]>

  export type StockPorDepositoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productoId?: boolean
    depositoId?: boolean
    stockActual?: boolean
    stockMinimo?: boolean
    stockMaximo?: boolean
    capacidadMaxima?: boolean
    deposito?: boolean | DepositoDefaultArgs<ExtArgs>
    producto?: boolean | ProductoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["stockPorDeposito"]>

  export type StockPorDepositoSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productoId?: boolean
    depositoId?: boolean
    stockActual?: boolean
    stockMinimo?: boolean
    stockMaximo?: boolean
    capacidadMaxima?: boolean
    deposito?: boolean | DepositoDefaultArgs<ExtArgs>
    producto?: boolean | ProductoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["stockPorDeposito"]>

  export type StockPorDepositoSelectScalar = {
    id?: boolean
    productoId?: boolean
    depositoId?: boolean
    stockActual?: boolean
    stockMinimo?: boolean
    stockMaximo?: boolean
    capacidadMaxima?: boolean
  }

  export type StockPorDepositoOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "productoId" | "depositoId" | "stockActual" | "stockMinimo" | "stockMaximo" | "capacidadMaxima", ExtArgs["result"]["stockPorDeposito"]>
  export type StockPorDepositoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    detallesMovimiento?: boolean | StockPorDeposito$detallesMovimientoArgs<ExtArgs>
    deposito?: boolean | DepositoDefaultArgs<ExtArgs>
    producto?: boolean | ProductoDefaultArgs<ExtArgs>
    _count?: boolean | StockPorDepositoCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type StockPorDepositoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    deposito?: boolean | DepositoDefaultArgs<ExtArgs>
    producto?: boolean | ProductoDefaultArgs<ExtArgs>
  }
  export type StockPorDepositoIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    deposito?: boolean | DepositoDefaultArgs<ExtArgs>
    producto?: boolean | ProductoDefaultArgs<ExtArgs>
  }

  export type $StockPorDepositoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "StockPorDeposito"
    objects: {
      detallesMovimiento: Prisma.$DetalleMovimientoPayload<ExtArgs>[]
      deposito: Prisma.$DepositoPayload<ExtArgs>
      producto: Prisma.$ProductoPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      productoId: number
      depositoId: number
      stockActual: number
      stockMinimo: number
      stockMaximo: number | null
      capacidadMaxima: number | null
    }, ExtArgs["result"]["stockPorDeposito"]>
    composites: {}
  }

  type StockPorDepositoGetPayload<S extends boolean | null | undefined | StockPorDepositoDefaultArgs> = $Result.GetResult<Prisma.$StockPorDepositoPayload, S>

  type StockPorDepositoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<StockPorDepositoFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: StockPorDepositoCountAggregateInputType | true
    }

  export interface StockPorDepositoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['StockPorDeposito'], meta: { name: 'StockPorDeposito' } }
    /**
     * Find zero or one StockPorDeposito that matches the filter.
     * @param {StockPorDepositoFindUniqueArgs} args - Arguments to find a StockPorDeposito
     * @example
     * // Get one StockPorDeposito
     * const stockPorDeposito = await prisma.stockPorDeposito.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends StockPorDepositoFindUniqueArgs>(args: SelectSubset<T, StockPorDepositoFindUniqueArgs<ExtArgs>>): Prisma__StockPorDepositoClient<$Result.GetResult<Prisma.$StockPorDepositoPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one StockPorDeposito that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {StockPorDepositoFindUniqueOrThrowArgs} args - Arguments to find a StockPorDeposito
     * @example
     * // Get one StockPorDeposito
     * const stockPorDeposito = await prisma.stockPorDeposito.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends StockPorDepositoFindUniqueOrThrowArgs>(args: SelectSubset<T, StockPorDepositoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__StockPorDepositoClient<$Result.GetResult<Prisma.$StockPorDepositoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first StockPorDeposito that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StockPorDepositoFindFirstArgs} args - Arguments to find a StockPorDeposito
     * @example
     * // Get one StockPorDeposito
     * const stockPorDeposito = await prisma.stockPorDeposito.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends StockPorDepositoFindFirstArgs>(args?: SelectSubset<T, StockPorDepositoFindFirstArgs<ExtArgs>>): Prisma__StockPorDepositoClient<$Result.GetResult<Prisma.$StockPorDepositoPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first StockPorDeposito that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StockPorDepositoFindFirstOrThrowArgs} args - Arguments to find a StockPorDeposito
     * @example
     * // Get one StockPorDeposito
     * const stockPorDeposito = await prisma.stockPorDeposito.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends StockPorDepositoFindFirstOrThrowArgs>(args?: SelectSubset<T, StockPorDepositoFindFirstOrThrowArgs<ExtArgs>>): Prisma__StockPorDepositoClient<$Result.GetResult<Prisma.$StockPorDepositoPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more StockPorDepositos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StockPorDepositoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all StockPorDepositos
     * const stockPorDepositos = await prisma.stockPorDeposito.findMany()
     * 
     * // Get first 10 StockPorDepositos
     * const stockPorDepositos = await prisma.stockPorDeposito.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const stockPorDepositoWithIdOnly = await prisma.stockPorDeposito.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends StockPorDepositoFindManyArgs>(args?: SelectSubset<T, StockPorDepositoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StockPorDepositoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a StockPorDeposito.
     * @param {StockPorDepositoCreateArgs} args - Arguments to create a StockPorDeposito.
     * @example
     * // Create one StockPorDeposito
     * const StockPorDeposito = await prisma.stockPorDeposito.create({
     *   data: {
     *     // ... data to create a StockPorDeposito
     *   }
     * })
     * 
     */
    create<T extends StockPorDepositoCreateArgs>(args: SelectSubset<T, StockPorDepositoCreateArgs<ExtArgs>>): Prisma__StockPorDepositoClient<$Result.GetResult<Prisma.$StockPorDepositoPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many StockPorDepositos.
     * @param {StockPorDepositoCreateManyArgs} args - Arguments to create many StockPorDepositos.
     * @example
     * // Create many StockPorDepositos
     * const stockPorDeposito = await prisma.stockPorDeposito.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends StockPorDepositoCreateManyArgs>(args?: SelectSubset<T, StockPorDepositoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many StockPorDepositos and returns the data saved in the database.
     * @param {StockPorDepositoCreateManyAndReturnArgs} args - Arguments to create many StockPorDepositos.
     * @example
     * // Create many StockPorDepositos
     * const stockPorDeposito = await prisma.stockPorDeposito.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many StockPorDepositos and only return the `id`
     * const stockPorDepositoWithIdOnly = await prisma.stockPorDeposito.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends StockPorDepositoCreateManyAndReturnArgs>(args?: SelectSubset<T, StockPorDepositoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StockPorDepositoPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a StockPorDeposito.
     * @param {StockPorDepositoDeleteArgs} args - Arguments to delete one StockPorDeposito.
     * @example
     * // Delete one StockPorDeposito
     * const StockPorDeposito = await prisma.stockPorDeposito.delete({
     *   where: {
     *     // ... filter to delete one StockPorDeposito
     *   }
     * })
     * 
     */
    delete<T extends StockPorDepositoDeleteArgs>(args: SelectSubset<T, StockPorDepositoDeleteArgs<ExtArgs>>): Prisma__StockPorDepositoClient<$Result.GetResult<Prisma.$StockPorDepositoPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one StockPorDeposito.
     * @param {StockPorDepositoUpdateArgs} args - Arguments to update one StockPorDeposito.
     * @example
     * // Update one StockPorDeposito
     * const stockPorDeposito = await prisma.stockPorDeposito.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends StockPorDepositoUpdateArgs>(args: SelectSubset<T, StockPorDepositoUpdateArgs<ExtArgs>>): Prisma__StockPorDepositoClient<$Result.GetResult<Prisma.$StockPorDepositoPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more StockPorDepositos.
     * @param {StockPorDepositoDeleteManyArgs} args - Arguments to filter StockPorDepositos to delete.
     * @example
     * // Delete a few StockPorDepositos
     * const { count } = await prisma.stockPorDeposito.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends StockPorDepositoDeleteManyArgs>(args?: SelectSubset<T, StockPorDepositoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more StockPorDepositos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StockPorDepositoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many StockPorDepositos
     * const stockPorDeposito = await prisma.stockPorDeposito.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends StockPorDepositoUpdateManyArgs>(args: SelectSubset<T, StockPorDepositoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more StockPorDepositos and returns the data updated in the database.
     * @param {StockPorDepositoUpdateManyAndReturnArgs} args - Arguments to update many StockPorDepositos.
     * @example
     * // Update many StockPorDepositos
     * const stockPorDeposito = await prisma.stockPorDeposito.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more StockPorDepositos and only return the `id`
     * const stockPorDepositoWithIdOnly = await prisma.stockPorDeposito.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends StockPorDepositoUpdateManyAndReturnArgs>(args: SelectSubset<T, StockPorDepositoUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StockPorDepositoPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one StockPorDeposito.
     * @param {StockPorDepositoUpsertArgs} args - Arguments to update or create a StockPorDeposito.
     * @example
     * // Update or create a StockPorDeposito
     * const stockPorDeposito = await prisma.stockPorDeposito.upsert({
     *   create: {
     *     // ... data to create a StockPorDeposito
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the StockPorDeposito we want to update
     *   }
     * })
     */
    upsert<T extends StockPorDepositoUpsertArgs>(args: SelectSubset<T, StockPorDepositoUpsertArgs<ExtArgs>>): Prisma__StockPorDepositoClient<$Result.GetResult<Prisma.$StockPorDepositoPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of StockPorDepositos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StockPorDepositoCountArgs} args - Arguments to filter StockPorDepositos to count.
     * @example
     * // Count the number of StockPorDepositos
     * const count = await prisma.stockPorDeposito.count({
     *   where: {
     *     // ... the filter for the StockPorDepositos we want to count
     *   }
     * })
    **/
    count<T extends StockPorDepositoCountArgs>(
      args?: Subset<T, StockPorDepositoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], StockPorDepositoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a StockPorDeposito.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StockPorDepositoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends StockPorDepositoAggregateArgs>(args: Subset<T, StockPorDepositoAggregateArgs>): Prisma.PrismaPromise<GetStockPorDepositoAggregateType<T>>

    /**
     * Group by StockPorDeposito.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StockPorDepositoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends StockPorDepositoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: StockPorDepositoGroupByArgs['orderBy'] }
        : { orderBy?: StockPorDepositoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, StockPorDepositoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStockPorDepositoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the StockPorDeposito model
   */
  readonly fields: StockPorDepositoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for StockPorDeposito.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__StockPorDepositoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    detallesMovimiento<T extends StockPorDeposito$detallesMovimientoArgs<ExtArgs> = {}>(args?: Subset<T, StockPorDeposito$detallesMovimientoArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DetalleMovimientoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    deposito<T extends DepositoDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DepositoDefaultArgs<ExtArgs>>): Prisma__DepositoClient<$Result.GetResult<Prisma.$DepositoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    producto<T extends ProductoDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProductoDefaultArgs<ExtArgs>>): Prisma__ProductoClient<$Result.GetResult<Prisma.$ProductoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the StockPorDeposito model
   */
  interface StockPorDepositoFieldRefs {
    readonly id: FieldRef<"StockPorDeposito", 'Int'>
    readonly productoId: FieldRef<"StockPorDeposito", 'Int'>
    readonly depositoId: FieldRef<"StockPorDeposito", 'Int'>
    readonly stockActual: FieldRef<"StockPorDeposito", 'Int'>
    readonly stockMinimo: FieldRef<"StockPorDeposito", 'Int'>
    readonly stockMaximo: FieldRef<"StockPorDeposito", 'Int'>
    readonly capacidadMaxima: FieldRef<"StockPorDeposito", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * StockPorDeposito findUnique
   */
  export type StockPorDepositoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockPorDeposito
     */
    select?: StockPorDepositoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockPorDeposito
     */
    omit?: StockPorDepositoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockPorDepositoInclude<ExtArgs> | null
    /**
     * Filter, which StockPorDeposito to fetch.
     */
    where: StockPorDepositoWhereUniqueInput
  }

  /**
   * StockPorDeposito findUniqueOrThrow
   */
  export type StockPorDepositoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockPorDeposito
     */
    select?: StockPorDepositoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockPorDeposito
     */
    omit?: StockPorDepositoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockPorDepositoInclude<ExtArgs> | null
    /**
     * Filter, which StockPorDeposito to fetch.
     */
    where: StockPorDepositoWhereUniqueInput
  }

  /**
   * StockPorDeposito findFirst
   */
  export type StockPorDepositoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockPorDeposito
     */
    select?: StockPorDepositoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockPorDeposito
     */
    omit?: StockPorDepositoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockPorDepositoInclude<ExtArgs> | null
    /**
     * Filter, which StockPorDeposito to fetch.
     */
    where?: StockPorDepositoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StockPorDepositos to fetch.
     */
    orderBy?: StockPorDepositoOrderByWithRelationInput | StockPorDepositoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StockPorDepositos.
     */
    cursor?: StockPorDepositoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StockPorDepositos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StockPorDepositos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StockPorDepositos.
     */
    distinct?: StockPorDepositoScalarFieldEnum | StockPorDepositoScalarFieldEnum[]
  }

  /**
   * StockPorDeposito findFirstOrThrow
   */
  export type StockPorDepositoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockPorDeposito
     */
    select?: StockPorDepositoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockPorDeposito
     */
    omit?: StockPorDepositoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockPorDepositoInclude<ExtArgs> | null
    /**
     * Filter, which StockPorDeposito to fetch.
     */
    where?: StockPorDepositoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StockPorDepositos to fetch.
     */
    orderBy?: StockPorDepositoOrderByWithRelationInput | StockPorDepositoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StockPorDepositos.
     */
    cursor?: StockPorDepositoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StockPorDepositos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StockPorDepositos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StockPorDepositos.
     */
    distinct?: StockPorDepositoScalarFieldEnum | StockPorDepositoScalarFieldEnum[]
  }

  /**
   * StockPorDeposito findMany
   */
  export type StockPorDepositoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockPorDeposito
     */
    select?: StockPorDepositoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockPorDeposito
     */
    omit?: StockPorDepositoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockPorDepositoInclude<ExtArgs> | null
    /**
     * Filter, which StockPorDepositos to fetch.
     */
    where?: StockPorDepositoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StockPorDepositos to fetch.
     */
    orderBy?: StockPorDepositoOrderByWithRelationInput | StockPorDepositoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing StockPorDepositos.
     */
    cursor?: StockPorDepositoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StockPorDepositos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StockPorDepositos.
     */
    skip?: number
    distinct?: StockPorDepositoScalarFieldEnum | StockPorDepositoScalarFieldEnum[]
  }

  /**
   * StockPorDeposito create
   */
  export type StockPorDepositoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockPorDeposito
     */
    select?: StockPorDepositoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockPorDeposito
     */
    omit?: StockPorDepositoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockPorDepositoInclude<ExtArgs> | null
    /**
     * The data needed to create a StockPorDeposito.
     */
    data: XOR<StockPorDepositoCreateInput, StockPorDepositoUncheckedCreateInput>
  }

  /**
   * StockPorDeposito createMany
   */
  export type StockPorDepositoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many StockPorDepositos.
     */
    data: StockPorDepositoCreateManyInput | StockPorDepositoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * StockPorDeposito createManyAndReturn
   */
  export type StockPorDepositoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockPorDeposito
     */
    select?: StockPorDepositoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the StockPorDeposito
     */
    omit?: StockPorDepositoOmit<ExtArgs> | null
    /**
     * The data used to create many StockPorDepositos.
     */
    data: StockPorDepositoCreateManyInput | StockPorDepositoCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockPorDepositoIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * StockPorDeposito update
   */
  export type StockPorDepositoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockPorDeposito
     */
    select?: StockPorDepositoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockPorDeposito
     */
    omit?: StockPorDepositoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockPorDepositoInclude<ExtArgs> | null
    /**
     * The data needed to update a StockPorDeposito.
     */
    data: XOR<StockPorDepositoUpdateInput, StockPorDepositoUncheckedUpdateInput>
    /**
     * Choose, which StockPorDeposito to update.
     */
    where: StockPorDepositoWhereUniqueInput
  }

  /**
   * StockPorDeposito updateMany
   */
  export type StockPorDepositoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update StockPorDepositos.
     */
    data: XOR<StockPorDepositoUpdateManyMutationInput, StockPorDepositoUncheckedUpdateManyInput>
    /**
     * Filter which StockPorDepositos to update
     */
    where?: StockPorDepositoWhereInput
    /**
     * Limit how many StockPorDepositos to update.
     */
    limit?: number
  }

  /**
   * StockPorDeposito updateManyAndReturn
   */
  export type StockPorDepositoUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockPorDeposito
     */
    select?: StockPorDepositoSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the StockPorDeposito
     */
    omit?: StockPorDepositoOmit<ExtArgs> | null
    /**
     * The data used to update StockPorDepositos.
     */
    data: XOR<StockPorDepositoUpdateManyMutationInput, StockPorDepositoUncheckedUpdateManyInput>
    /**
     * Filter which StockPorDepositos to update
     */
    where?: StockPorDepositoWhereInput
    /**
     * Limit how many StockPorDepositos to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockPorDepositoIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * StockPorDeposito upsert
   */
  export type StockPorDepositoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockPorDeposito
     */
    select?: StockPorDepositoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockPorDeposito
     */
    omit?: StockPorDepositoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockPorDepositoInclude<ExtArgs> | null
    /**
     * The filter to search for the StockPorDeposito to update in case it exists.
     */
    where: StockPorDepositoWhereUniqueInput
    /**
     * In case the StockPorDeposito found by the `where` argument doesn't exist, create a new StockPorDeposito with this data.
     */
    create: XOR<StockPorDepositoCreateInput, StockPorDepositoUncheckedCreateInput>
    /**
     * In case the StockPorDeposito was found with the provided `where` argument, update it with this data.
     */
    update: XOR<StockPorDepositoUpdateInput, StockPorDepositoUncheckedUpdateInput>
  }

  /**
   * StockPorDeposito delete
   */
  export type StockPorDepositoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockPorDeposito
     */
    select?: StockPorDepositoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockPorDeposito
     */
    omit?: StockPorDepositoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockPorDepositoInclude<ExtArgs> | null
    /**
     * Filter which StockPorDeposito to delete.
     */
    where: StockPorDepositoWhereUniqueInput
  }

  /**
   * StockPorDeposito deleteMany
   */
  export type StockPorDepositoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StockPorDepositos to delete
     */
    where?: StockPorDepositoWhereInput
    /**
     * Limit how many StockPorDepositos to delete.
     */
    limit?: number
  }

  /**
   * StockPorDeposito.detallesMovimiento
   */
  export type StockPorDeposito$detallesMovimientoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DetalleMovimiento
     */
    select?: DetalleMovimientoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DetalleMovimiento
     */
    omit?: DetalleMovimientoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DetalleMovimientoInclude<ExtArgs> | null
    where?: DetalleMovimientoWhereInput
    orderBy?: DetalleMovimientoOrderByWithRelationInput | DetalleMovimientoOrderByWithRelationInput[]
    cursor?: DetalleMovimientoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DetalleMovimientoScalarFieldEnum | DetalleMovimientoScalarFieldEnum[]
  }

  /**
   * StockPorDeposito without action
   */
  export type StockPorDepositoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StockPorDeposito
     */
    select?: StockPorDepositoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StockPorDeposito
     */
    omit?: StockPorDepositoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StockPorDepositoInclude<ExtArgs> | null
  }


  /**
   * Model MovimientoStock
   */

  export type AggregateMovimientoStock = {
    _count: MovimientoStockCountAggregateOutputType | null
    _avg: MovimientoStockAvgAggregateOutputType | null
    _sum: MovimientoStockSumAggregateOutputType | null
    _min: MovimientoStockMinAggregateOutputType | null
    _max: MovimientoStockMaxAggregateOutputType | null
  }

  export type MovimientoStockAvgAggregateOutputType = {
    id: number | null
    depositoId: number | null
    tipoMovimientoId: number | null
    tipoComprobanteId: number | null
  }

  export type MovimientoStockSumAggregateOutputType = {
    id: number | null
    depositoId: number | null
    tipoMovimientoId: number | null
    tipoComprobanteId: number | null
  }

  export type MovimientoStockMinAggregateOutputType = {
    id: number | null
    depositoId: number | null
    tipoMovimientoId: number | null
    tipoComprobanteId: number | null
    fecha: Date | null
    hora: Date | null
  }

  export type MovimientoStockMaxAggregateOutputType = {
    id: number | null
    depositoId: number | null
    tipoMovimientoId: number | null
    tipoComprobanteId: number | null
    fecha: Date | null
    hora: Date | null
  }

  export type MovimientoStockCountAggregateOutputType = {
    id: number
    depositoId: number
    tipoMovimientoId: number
    tipoComprobanteId: number
    fecha: number
    hora: number
    _all: number
  }


  export type MovimientoStockAvgAggregateInputType = {
    id?: true
    depositoId?: true
    tipoMovimientoId?: true
    tipoComprobanteId?: true
  }

  export type MovimientoStockSumAggregateInputType = {
    id?: true
    depositoId?: true
    tipoMovimientoId?: true
    tipoComprobanteId?: true
  }

  export type MovimientoStockMinAggregateInputType = {
    id?: true
    depositoId?: true
    tipoMovimientoId?: true
    tipoComprobanteId?: true
    fecha?: true
    hora?: true
  }

  export type MovimientoStockMaxAggregateInputType = {
    id?: true
    depositoId?: true
    tipoMovimientoId?: true
    tipoComprobanteId?: true
    fecha?: true
    hora?: true
  }

  export type MovimientoStockCountAggregateInputType = {
    id?: true
    depositoId?: true
    tipoMovimientoId?: true
    tipoComprobanteId?: true
    fecha?: true
    hora?: true
    _all?: true
  }

  export type MovimientoStockAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MovimientoStock to aggregate.
     */
    where?: MovimientoStockWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MovimientoStocks to fetch.
     */
    orderBy?: MovimientoStockOrderByWithRelationInput | MovimientoStockOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MovimientoStockWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MovimientoStocks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MovimientoStocks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MovimientoStocks
    **/
    _count?: true | MovimientoStockCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MovimientoStockAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MovimientoStockSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MovimientoStockMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MovimientoStockMaxAggregateInputType
  }

  export type GetMovimientoStockAggregateType<T extends MovimientoStockAggregateArgs> = {
        [P in keyof T & keyof AggregateMovimientoStock]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMovimientoStock[P]>
      : GetScalarType<T[P], AggregateMovimientoStock[P]>
  }




  export type MovimientoStockGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MovimientoStockWhereInput
    orderBy?: MovimientoStockOrderByWithAggregationInput | MovimientoStockOrderByWithAggregationInput[]
    by: MovimientoStockScalarFieldEnum[] | MovimientoStockScalarFieldEnum
    having?: MovimientoStockScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MovimientoStockCountAggregateInputType | true
    _avg?: MovimientoStockAvgAggregateInputType
    _sum?: MovimientoStockSumAggregateInputType
    _min?: MovimientoStockMinAggregateInputType
    _max?: MovimientoStockMaxAggregateInputType
  }

  export type MovimientoStockGroupByOutputType = {
    id: number
    depositoId: number
    tipoMovimientoId: number
    tipoComprobanteId: number
    fecha: Date
    hora: Date
    _count: MovimientoStockCountAggregateOutputType | null
    _avg: MovimientoStockAvgAggregateOutputType | null
    _sum: MovimientoStockSumAggregateOutputType | null
    _min: MovimientoStockMinAggregateOutputType | null
    _max: MovimientoStockMaxAggregateOutputType | null
  }

  type GetMovimientoStockGroupByPayload<T extends MovimientoStockGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MovimientoStockGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MovimientoStockGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MovimientoStockGroupByOutputType[P]>
            : GetScalarType<T[P], MovimientoStockGroupByOutputType[P]>
        }
      >
    >


  export type MovimientoStockSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    depositoId?: boolean
    tipoMovimientoId?: boolean
    tipoComprobanteId?: boolean
    fecha?: boolean
    hora?: boolean
    detalles?: boolean | MovimientoStock$detallesArgs<ExtArgs>
    deposito?: boolean | DepositoDefaultArgs<ExtArgs>
    tipoComprobante?: boolean | TipoComprobanteDefaultArgs<ExtArgs>
    tipoMovimiento?: boolean | TipoMovimientoDefaultArgs<ExtArgs>
    _count?: boolean | MovimientoStockCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["movimientoStock"]>

  export type MovimientoStockSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    depositoId?: boolean
    tipoMovimientoId?: boolean
    tipoComprobanteId?: boolean
    fecha?: boolean
    hora?: boolean
    deposito?: boolean | DepositoDefaultArgs<ExtArgs>
    tipoComprobante?: boolean | TipoComprobanteDefaultArgs<ExtArgs>
    tipoMovimiento?: boolean | TipoMovimientoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["movimientoStock"]>

  export type MovimientoStockSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    depositoId?: boolean
    tipoMovimientoId?: boolean
    tipoComprobanteId?: boolean
    fecha?: boolean
    hora?: boolean
    deposito?: boolean | DepositoDefaultArgs<ExtArgs>
    tipoComprobante?: boolean | TipoComprobanteDefaultArgs<ExtArgs>
    tipoMovimiento?: boolean | TipoMovimientoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["movimientoStock"]>

  export type MovimientoStockSelectScalar = {
    id?: boolean
    depositoId?: boolean
    tipoMovimientoId?: boolean
    tipoComprobanteId?: boolean
    fecha?: boolean
    hora?: boolean
  }

  export type MovimientoStockOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "depositoId" | "tipoMovimientoId" | "tipoComprobanteId" | "fecha" | "hora", ExtArgs["result"]["movimientoStock"]>
  export type MovimientoStockInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    detalles?: boolean | MovimientoStock$detallesArgs<ExtArgs>
    deposito?: boolean | DepositoDefaultArgs<ExtArgs>
    tipoComprobante?: boolean | TipoComprobanteDefaultArgs<ExtArgs>
    tipoMovimiento?: boolean | TipoMovimientoDefaultArgs<ExtArgs>
    _count?: boolean | MovimientoStockCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type MovimientoStockIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    deposito?: boolean | DepositoDefaultArgs<ExtArgs>
    tipoComprobante?: boolean | TipoComprobanteDefaultArgs<ExtArgs>
    tipoMovimiento?: boolean | TipoMovimientoDefaultArgs<ExtArgs>
  }
  export type MovimientoStockIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    deposito?: boolean | DepositoDefaultArgs<ExtArgs>
    tipoComprobante?: boolean | TipoComprobanteDefaultArgs<ExtArgs>
    tipoMovimiento?: boolean | TipoMovimientoDefaultArgs<ExtArgs>
  }

  export type $MovimientoStockPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MovimientoStock"
    objects: {
      detalles: Prisma.$DetalleMovimientoPayload<ExtArgs>[]
      deposito: Prisma.$DepositoPayload<ExtArgs>
      tipoComprobante: Prisma.$TipoComprobantePayload<ExtArgs>
      tipoMovimiento: Prisma.$TipoMovimientoPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      depositoId: number
      tipoMovimientoId: number
      tipoComprobanteId: number
      fecha: Date
      hora: Date
    }, ExtArgs["result"]["movimientoStock"]>
    composites: {}
  }

  type MovimientoStockGetPayload<S extends boolean | null | undefined | MovimientoStockDefaultArgs> = $Result.GetResult<Prisma.$MovimientoStockPayload, S>

  type MovimientoStockCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MovimientoStockFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MovimientoStockCountAggregateInputType | true
    }

  export interface MovimientoStockDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MovimientoStock'], meta: { name: 'MovimientoStock' } }
    /**
     * Find zero or one MovimientoStock that matches the filter.
     * @param {MovimientoStockFindUniqueArgs} args - Arguments to find a MovimientoStock
     * @example
     * // Get one MovimientoStock
     * const movimientoStock = await prisma.movimientoStock.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MovimientoStockFindUniqueArgs>(args: SelectSubset<T, MovimientoStockFindUniqueArgs<ExtArgs>>): Prisma__MovimientoStockClient<$Result.GetResult<Prisma.$MovimientoStockPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one MovimientoStock that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MovimientoStockFindUniqueOrThrowArgs} args - Arguments to find a MovimientoStock
     * @example
     * // Get one MovimientoStock
     * const movimientoStock = await prisma.movimientoStock.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MovimientoStockFindUniqueOrThrowArgs>(args: SelectSubset<T, MovimientoStockFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MovimientoStockClient<$Result.GetResult<Prisma.$MovimientoStockPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MovimientoStock that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MovimientoStockFindFirstArgs} args - Arguments to find a MovimientoStock
     * @example
     * // Get one MovimientoStock
     * const movimientoStock = await prisma.movimientoStock.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MovimientoStockFindFirstArgs>(args?: SelectSubset<T, MovimientoStockFindFirstArgs<ExtArgs>>): Prisma__MovimientoStockClient<$Result.GetResult<Prisma.$MovimientoStockPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MovimientoStock that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MovimientoStockFindFirstOrThrowArgs} args - Arguments to find a MovimientoStock
     * @example
     * // Get one MovimientoStock
     * const movimientoStock = await prisma.movimientoStock.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MovimientoStockFindFirstOrThrowArgs>(args?: SelectSubset<T, MovimientoStockFindFirstOrThrowArgs<ExtArgs>>): Prisma__MovimientoStockClient<$Result.GetResult<Prisma.$MovimientoStockPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more MovimientoStocks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MovimientoStockFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MovimientoStocks
     * const movimientoStocks = await prisma.movimientoStock.findMany()
     * 
     * // Get first 10 MovimientoStocks
     * const movimientoStocks = await prisma.movimientoStock.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const movimientoStockWithIdOnly = await prisma.movimientoStock.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MovimientoStockFindManyArgs>(args?: SelectSubset<T, MovimientoStockFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MovimientoStockPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a MovimientoStock.
     * @param {MovimientoStockCreateArgs} args - Arguments to create a MovimientoStock.
     * @example
     * // Create one MovimientoStock
     * const MovimientoStock = await prisma.movimientoStock.create({
     *   data: {
     *     // ... data to create a MovimientoStock
     *   }
     * })
     * 
     */
    create<T extends MovimientoStockCreateArgs>(args: SelectSubset<T, MovimientoStockCreateArgs<ExtArgs>>): Prisma__MovimientoStockClient<$Result.GetResult<Prisma.$MovimientoStockPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many MovimientoStocks.
     * @param {MovimientoStockCreateManyArgs} args - Arguments to create many MovimientoStocks.
     * @example
     * // Create many MovimientoStocks
     * const movimientoStock = await prisma.movimientoStock.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MovimientoStockCreateManyArgs>(args?: SelectSubset<T, MovimientoStockCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many MovimientoStocks and returns the data saved in the database.
     * @param {MovimientoStockCreateManyAndReturnArgs} args - Arguments to create many MovimientoStocks.
     * @example
     * // Create many MovimientoStocks
     * const movimientoStock = await prisma.movimientoStock.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many MovimientoStocks and only return the `id`
     * const movimientoStockWithIdOnly = await prisma.movimientoStock.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MovimientoStockCreateManyAndReturnArgs>(args?: SelectSubset<T, MovimientoStockCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MovimientoStockPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a MovimientoStock.
     * @param {MovimientoStockDeleteArgs} args - Arguments to delete one MovimientoStock.
     * @example
     * // Delete one MovimientoStock
     * const MovimientoStock = await prisma.movimientoStock.delete({
     *   where: {
     *     // ... filter to delete one MovimientoStock
     *   }
     * })
     * 
     */
    delete<T extends MovimientoStockDeleteArgs>(args: SelectSubset<T, MovimientoStockDeleteArgs<ExtArgs>>): Prisma__MovimientoStockClient<$Result.GetResult<Prisma.$MovimientoStockPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one MovimientoStock.
     * @param {MovimientoStockUpdateArgs} args - Arguments to update one MovimientoStock.
     * @example
     * // Update one MovimientoStock
     * const movimientoStock = await prisma.movimientoStock.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MovimientoStockUpdateArgs>(args: SelectSubset<T, MovimientoStockUpdateArgs<ExtArgs>>): Prisma__MovimientoStockClient<$Result.GetResult<Prisma.$MovimientoStockPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more MovimientoStocks.
     * @param {MovimientoStockDeleteManyArgs} args - Arguments to filter MovimientoStocks to delete.
     * @example
     * // Delete a few MovimientoStocks
     * const { count } = await prisma.movimientoStock.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MovimientoStockDeleteManyArgs>(args?: SelectSubset<T, MovimientoStockDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MovimientoStocks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MovimientoStockUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MovimientoStocks
     * const movimientoStock = await prisma.movimientoStock.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MovimientoStockUpdateManyArgs>(args: SelectSubset<T, MovimientoStockUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MovimientoStocks and returns the data updated in the database.
     * @param {MovimientoStockUpdateManyAndReturnArgs} args - Arguments to update many MovimientoStocks.
     * @example
     * // Update many MovimientoStocks
     * const movimientoStock = await prisma.movimientoStock.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more MovimientoStocks and only return the `id`
     * const movimientoStockWithIdOnly = await prisma.movimientoStock.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MovimientoStockUpdateManyAndReturnArgs>(args: SelectSubset<T, MovimientoStockUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MovimientoStockPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one MovimientoStock.
     * @param {MovimientoStockUpsertArgs} args - Arguments to update or create a MovimientoStock.
     * @example
     * // Update or create a MovimientoStock
     * const movimientoStock = await prisma.movimientoStock.upsert({
     *   create: {
     *     // ... data to create a MovimientoStock
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MovimientoStock we want to update
     *   }
     * })
     */
    upsert<T extends MovimientoStockUpsertArgs>(args: SelectSubset<T, MovimientoStockUpsertArgs<ExtArgs>>): Prisma__MovimientoStockClient<$Result.GetResult<Prisma.$MovimientoStockPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of MovimientoStocks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MovimientoStockCountArgs} args - Arguments to filter MovimientoStocks to count.
     * @example
     * // Count the number of MovimientoStocks
     * const count = await prisma.movimientoStock.count({
     *   where: {
     *     // ... the filter for the MovimientoStocks we want to count
     *   }
     * })
    **/
    count<T extends MovimientoStockCountArgs>(
      args?: Subset<T, MovimientoStockCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MovimientoStockCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MovimientoStock.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MovimientoStockAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MovimientoStockAggregateArgs>(args: Subset<T, MovimientoStockAggregateArgs>): Prisma.PrismaPromise<GetMovimientoStockAggregateType<T>>

    /**
     * Group by MovimientoStock.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MovimientoStockGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MovimientoStockGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MovimientoStockGroupByArgs['orderBy'] }
        : { orderBy?: MovimientoStockGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MovimientoStockGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMovimientoStockGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MovimientoStock model
   */
  readonly fields: MovimientoStockFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MovimientoStock.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MovimientoStockClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    detalles<T extends MovimientoStock$detallesArgs<ExtArgs> = {}>(args?: Subset<T, MovimientoStock$detallesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DetalleMovimientoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    deposito<T extends DepositoDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DepositoDefaultArgs<ExtArgs>>): Prisma__DepositoClient<$Result.GetResult<Prisma.$DepositoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    tipoComprobante<T extends TipoComprobanteDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TipoComprobanteDefaultArgs<ExtArgs>>): Prisma__TipoComprobanteClient<$Result.GetResult<Prisma.$TipoComprobantePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    tipoMovimiento<T extends TipoMovimientoDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TipoMovimientoDefaultArgs<ExtArgs>>): Prisma__TipoMovimientoClient<$Result.GetResult<Prisma.$TipoMovimientoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the MovimientoStock model
   */
  interface MovimientoStockFieldRefs {
    readonly id: FieldRef<"MovimientoStock", 'Int'>
    readonly depositoId: FieldRef<"MovimientoStock", 'Int'>
    readonly tipoMovimientoId: FieldRef<"MovimientoStock", 'Int'>
    readonly tipoComprobanteId: FieldRef<"MovimientoStock", 'Int'>
    readonly fecha: FieldRef<"MovimientoStock", 'DateTime'>
    readonly hora: FieldRef<"MovimientoStock", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * MovimientoStock findUnique
   */
  export type MovimientoStockFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MovimientoStock
     */
    select?: MovimientoStockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MovimientoStock
     */
    omit?: MovimientoStockOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MovimientoStockInclude<ExtArgs> | null
    /**
     * Filter, which MovimientoStock to fetch.
     */
    where: MovimientoStockWhereUniqueInput
  }

  /**
   * MovimientoStock findUniqueOrThrow
   */
  export type MovimientoStockFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MovimientoStock
     */
    select?: MovimientoStockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MovimientoStock
     */
    omit?: MovimientoStockOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MovimientoStockInclude<ExtArgs> | null
    /**
     * Filter, which MovimientoStock to fetch.
     */
    where: MovimientoStockWhereUniqueInput
  }

  /**
   * MovimientoStock findFirst
   */
  export type MovimientoStockFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MovimientoStock
     */
    select?: MovimientoStockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MovimientoStock
     */
    omit?: MovimientoStockOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MovimientoStockInclude<ExtArgs> | null
    /**
     * Filter, which MovimientoStock to fetch.
     */
    where?: MovimientoStockWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MovimientoStocks to fetch.
     */
    orderBy?: MovimientoStockOrderByWithRelationInput | MovimientoStockOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MovimientoStocks.
     */
    cursor?: MovimientoStockWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MovimientoStocks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MovimientoStocks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MovimientoStocks.
     */
    distinct?: MovimientoStockScalarFieldEnum | MovimientoStockScalarFieldEnum[]
  }

  /**
   * MovimientoStock findFirstOrThrow
   */
  export type MovimientoStockFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MovimientoStock
     */
    select?: MovimientoStockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MovimientoStock
     */
    omit?: MovimientoStockOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MovimientoStockInclude<ExtArgs> | null
    /**
     * Filter, which MovimientoStock to fetch.
     */
    where?: MovimientoStockWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MovimientoStocks to fetch.
     */
    orderBy?: MovimientoStockOrderByWithRelationInput | MovimientoStockOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MovimientoStocks.
     */
    cursor?: MovimientoStockWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MovimientoStocks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MovimientoStocks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MovimientoStocks.
     */
    distinct?: MovimientoStockScalarFieldEnum | MovimientoStockScalarFieldEnum[]
  }

  /**
   * MovimientoStock findMany
   */
  export type MovimientoStockFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MovimientoStock
     */
    select?: MovimientoStockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MovimientoStock
     */
    omit?: MovimientoStockOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MovimientoStockInclude<ExtArgs> | null
    /**
     * Filter, which MovimientoStocks to fetch.
     */
    where?: MovimientoStockWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MovimientoStocks to fetch.
     */
    orderBy?: MovimientoStockOrderByWithRelationInput | MovimientoStockOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MovimientoStocks.
     */
    cursor?: MovimientoStockWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MovimientoStocks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MovimientoStocks.
     */
    skip?: number
    distinct?: MovimientoStockScalarFieldEnum | MovimientoStockScalarFieldEnum[]
  }

  /**
   * MovimientoStock create
   */
  export type MovimientoStockCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MovimientoStock
     */
    select?: MovimientoStockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MovimientoStock
     */
    omit?: MovimientoStockOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MovimientoStockInclude<ExtArgs> | null
    /**
     * The data needed to create a MovimientoStock.
     */
    data: XOR<MovimientoStockCreateInput, MovimientoStockUncheckedCreateInput>
  }

  /**
   * MovimientoStock createMany
   */
  export type MovimientoStockCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MovimientoStocks.
     */
    data: MovimientoStockCreateManyInput | MovimientoStockCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MovimientoStock createManyAndReturn
   */
  export type MovimientoStockCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MovimientoStock
     */
    select?: MovimientoStockSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MovimientoStock
     */
    omit?: MovimientoStockOmit<ExtArgs> | null
    /**
     * The data used to create many MovimientoStocks.
     */
    data: MovimientoStockCreateManyInput | MovimientoStockCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MovimientoStockIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * MovimientoStock update
   */
  export type MovimientoStockUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MovimientoStock
     */
    select?: MovimientoStockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MovimientoStock
     */
    omit?: MovimientoStockOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MovimientoStockInclude<ExtArgs> | null
    /**
     * The data needed to update a MovimientoStock.
     */
    data: XOR<MovimientoStockUpdateInput, MovimientoStockUncheckedUpdateInput>
    /**
     * Choose, which MovimientoStock to update.
     */
    where: MovimientoStockWhereUniqueInput
  }

  /**
   * MovimientoStock updateMany
   */
  export type MovimientoStockUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MovimientoStocks.
     */
    data: XOR<MovimientoStockUpdateManyMutationInput, MovimientoStockUncheckedUpdateManyInput>
    /**
     * Filter which MovimientoStocks to update
     */
    where?: MovimientoStockWhereInput
    /**
     * Limit how many MovimientoStocks to update.
     */
    limit?: number
  }

  /**
   * MovimientoStock updateManyAndReturn
   */
  export type MovimientoStockUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MovimientoStock
     */
    select?: MovimientoStockSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MovimientoStock
     */
    omit?: MovimientoStockOmit<ExtArgs> | null
    /**
     * The data used to update MovimientoStocks.
     */
    data: XOR<MovimientoStockUpdateManyMutationInput, MovimientoStockUncheckedUpdateManyInput>
    /**
     * Filter which MovimientoStocks to update
     */
    where?: MovimientoStockWhereInput
    /**
     * Limit how many MovimientoStocks to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MovimientoStockIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * MovimientoStock upsert
   */
  export type MovimientoStockUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MovimientoStock
     */
    select?: MovimientoStockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MovimientoStock
     */
    omit?: MovimientoStockOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MovimientoStockInclude<ExtArgs> | null
    /**
     * The filter to search for the MovimientoStock to update in case it exists.
     */
    where: MovimientoStockWhereUniqueInput
    /**
     * In case the MovimientoStock found by the `where` argument doesn't exist, create a new MovimientoStock with this data.
     */
    create: XOR<MovimientoStockCreateInput, MovimientoStockUncheckedCreateInput>
    /**
     * In case the MovimientoStock was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MovimientoStockUpdateInput, MovimientoStockUncheckedUpdateInput>
  }

  /**
   * MovimientoStock delete
   */
  export type MovimientoStockDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MovimientoStock
     */
    select?: MovimientoStockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MovimientoStock
     */
    omit?: MovimientoStockOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MovimientoStockInclude<ExtArgs> | null
    /**
     * Filter which MovimientoStock to delete.
     */
    where: MovimientoStockWhereUniqueInput
  }

  /**
   * MovimientoStock deleteMany
   */
  export type MovimientoStockDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MovimientoStocks to delete
     */
    where?: MovimientoStockWhereInput
    /**
     * Limit how many MovimientoStocks to delete.
     */
    limit?: number
  }

  /**
   * MovimientoStock.detalles
   */
  export type MovimientoStock$detallesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DetalleMovimiento
     */
    select?: DetalleMovimientoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DetalleMovimiento
     */
    omit?: DetalleMovimientoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DetalleMovimientoInclude<ExtArgs> | null
    where?: DetalleMovimientoWhereInput
    orderBy?: DetalleMovimientoOrderByWithRelationInput | DetalleMovimientoOrderByWithRelationInput[]
    cursor?: DetalleMovimientoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DetalleMovimientoScalarFieldEnum | DetalleMovimientoScalarFieldEnum[]
  }

  /**
   * MovimientoStock without action
   */
  export type MovimientoStockDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MovimientoStock
     */
    select?: MovimientoStockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MovimientoStock
     */
    omit?: MovimientoStockOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MovimientoStockInclude<ExtArgs> | null
  }


  /**
   * Model DetalleMovimiento
   */

  export type AggregateDetalleMovimiento = {
    _count: DetalleMovimientoCountAggregateOutputType | null
    _avg: DetalleMovimientoAvgAggregateOutputType | null
    _sum: DetalleMovimientoSumAggregateOutputType | null
    _min: DetalleMovimientoMinAggregateOutputType | null
    _max: DetalleMovimientoMaxAggregateOutputType | null
  }

  export type DetalleMovimientoAvgAggregateOutputType = {
    id: number | null
    movimientoId: number | null
    stockId: number | null
    cantidad: number | null
  }

  export type DetalleMovimientoSumAggregateOutputType = {
    id: number | null
    movimientoId: number | null
    stockId: number | null
    cantidad: number | null
  }

  export type DetalleMovimientoMinAggregateOutputType = {
    id: number | null
    movimientoId: number | null
    stockId: number | null
    cantidad: number | null
  }

  export type DetalleMovimientoMaxAggregateOutputType = {
    id: number | null
    movimientoId: number | null
    stockId: number | null
    cantidad: number | null
  }

  export type DetalleMovimientoCountAggregateOutputType = {
    id: number
    movimientoId: number
    stockId: number
    cantidad: number
    _all: number
  }


  export type DetalleMovimientoAvgAggregateInputType = {
    id?: true
    movimientoId?: true
    stockId?: true
    cantidad?: true
  }

  export type DetalleMovimientoSumAggregateInputType = {
    id?: true
    movimientoId?: true
    stockId?: true
    cantidad?: true
  }

  export type DetalleMovimientoMinAggregateInputType = {
    id?: true
    movimientoId?: true
    stockId?: true
    cantidad?: true
  }

  export type DetalleMovimientoMaxAggregateInputType = {
    id?: true
    movimientoId?: true
    stockId?: true
    cantidad?: true
  }

  export type DetalleMovimientoCountAggregateInputType = {
    id?: true
    movimientoId?: true
    stockId?: true
    cantidad?: true
    _all?: true
  }

  export type DetalleMovimientoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DetalleMovimiento to aggregate.
     */
    where?: DetalleMovimientoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DetalleMovimientos to fetch.
     */
    orderBy?: DetalleMovimientoOrderByWithRelationInput | DetalleMovimientoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DetalleMovimientoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DetalleMovimientos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DetalleMovimientos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DetalleMovimientos
    **/
    _count?: true | DetalleMovimientoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DetalleMovimientoAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DetalleMovimientoSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DetalleMovimientoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DetalleMovimientoMaxAggregateInputType
  }

  export type GetDetalleMovimientoAggregateType<T extends DetalleMovimientoAggregateArgs> = {
        [P in keyof T & keyof AggregateDetalleMovimiento]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDetalleMovimiento[P]>
      : GetScalarType<T[P], AggregateDetalleMovimiento[P]>
  }




  export type DetalleMovimientoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DetalleMovimientoWhereInput
    orderBy?: DetalleMovimientoOrderByWithAggregationInput | DetalleMovimientoOrderByWithAggregationInput[]
    by: DetalleMovimientoScalarFieldEnum[] | DetalleMovimientoScalarFieldEnum
    having?: DetalleMovimientoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DetalleMovimientoCountAggregateInputType | true
    _avg?: DetalleMovimientoAvgAggregateInputType
    _sum?: DetalleMovimientoSumAggregateInputType
    _min?: DetalleMovimientoMinAggregateInputType
    _max?: DetalleMovimientoMaxAggregateInputType
  }

  export type DetalleMovimientoGroupByOutputType = {
    id: number
    movimientoId: number
    stockId: number
    cantidad: number
    _count: DetalleMovimientoCountAggregateOutputType | null
    _avg: DetalleMovimientoAvgAggregateOutputType | null
    _sum: DetalleMovimientoSumAggregateOutputType | null
    _min: DetalleMovimientoMinAggregateOutputType | null
    _max: DetalleMovimientoMaxAggregateOutputType | null
  }

  type GetDetalleMovimientoGroupByPayload<T extends DetalleMovimientoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DetalleMovimientoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DetalleMovimientoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DetalleMovimientoGroupByOutputType[P]>
            : GetScalarType<T[P], DetalleMovimientoGroupByOutputType[P]>
        }
      >
    >


  export type DetalleMovimientoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    movimientoId?: boolean
    stockId?: boolean
    cantidad?: boolean
    movimiento?: boolean | MovimientoStockDefaultArgs<ExtArgs>
    stock?: boolean | StockPorDepositoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["detalleMovimiento"]>

  export type DetalleMovimientoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    movimientoId?: boolean
    stockId?: boolean
    cantidad?: boolean
    movimiento?: boolean | MovimientoStockDefaultArgs<ExtArgs>
    stock?: boolean | StockPorDepositoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["detalleMovimiento"]>

  export type DetalleMovimientoSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    movimientoId?: boolean
    stockId?: boolean
    cantidad?: boolean
    movimiento?: boolean | MovimientoStockDefaultArgs<ExtArgs>
    stock?: boolean | StockPorDepositoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["detalleMovimiento"]>

  export type DetalleMovimientoSelectScalar = {
    id?: boolean
    movimientoId?: boolean
    stockId?: boolean
    cantidad?: boolean
  }

  export type DetalleMovimientoOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "movimientoId" | "stockId" | "cantidad", ExtArgs["result"]["detalleMovimiento"]>
  export type DetalleMovimientoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    movimiento?: boolean | MovimientoStockDefaultArgs<ExtArgs>
    stock?: boolean | StockPorDepositoDefaultArgs<ExtArgs>
  }
  export type DetalleMovimientoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    movimiento?: boolean | MovimientoStockDefaultArgs<ExtArgs>
    stock?: boolean | StockPorDepositoDefaultArgs<ExtArgs>
  }
  export type DetalleMovimientoIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    movimiento?: boolean | MovimientoStockDefaultArgs<ExtArgs>
    stock?: boolean | StockPorDepositoDefaultArgs<ExtArgs>
  }

  export type $DetalleMovimientoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DetalleMovimiento"
    objects: {
      movimiento: Prisma.$MovimientoStockPayload<ExtArgs>
      stock: Prisma.$StockPorDepositoPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      movimientoId: number
      stockId: number
      cantidad: number
    }, ExtArgs["result"]["detalleMovimiento"]>
    composites: {}
  }

  type DetalleMovimientoGetPayload<S extends boolean | null | undefined | DetalleMovimientoDefaultArgs> = $Result.GetResult<Prisma.$DetalleMovimientoPayload, S>

  type DetalleMovimientoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DetalleMovimientoFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DetalleMovimientoCountAggregateInputType | true
    }

  export interface DetalleMovimientoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DetalleMovimiento'], meta: { name: 'DetalleMovimiento' } }
    /**
     * Find zero or one DetalleMovimiento that matches the filter.
     * @param {DetalleMovimientoFindUniqueArgs} args - Arguments to find a DetalleMovimiento
     * @example
     * // Get one DetalleMovimiento
     * const detalleMovimiento = await prisma.detalleMovimiento.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DetalleMovimientoFindUniqueArgs>(args: SelectSubset<T, DetalleMovimientoFindUniqueArgs<ExtArgs>>): Prisma__DetalleMovimientoClient<$Result.GetResult<Prisma.$DetalleMovimientoPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one DetalleMovimiento that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DetalleMovimientoFindUniqueOrThrowArgs} args - Arguments to find a DetalleMovimiento
     * @example
     * // Get one DetalleMovimiento
     * const detalleMovimiento = await prisma.detalleMovimiento.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DetalleMovimientoFindUniqueOrThrowArgs>(args: SelectSubset<T, DetalleMovimientoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DetalleMovimientoClient<$Result.GetResult<Prisma.$DetalleMovimientoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DetalleMovimiento that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DetalleMovimientoFindFirstArgs} args - Arguments to find a DetalleMovimiento
     * @example
     * // Get one DetalleMovimiento
     * const detalleMovimiento = await prisma.detalleMovimiento.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DetalleMovimientoFindFirstArgs>(args?: SelectSubset<T, DetalleMovimientoFindFirstArgs<ExtArgs>>): Prisma__DetalleMovimientoClient<$Result.GetResult<Prisma.$DetalleMovimientoPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DetalleMovimiento that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DetalleMovimientoFindFirstOrThrowArgs} args - Arguments to find a DetalleMovimiento
     * @example
     * // Get one DetalleMovimiento
     * const detalleMovimiento = await prisma.detalleMovimiento.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DetalleMovimientoFindFirstOrThrowArgs>(args?: SelectSubset<T, DetalleMovimientoFindFirstOrThrowArgs<ExtArgs>>): Prisma__DetalleMovimientoClient<$Result.GetResult<Prisma.$DetalleMovimientoPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more DetalleMovimientos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DetalleMovimientoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DetalleMovimientos
     * const detalleMovimientos = await prisma.detalleMovimiento.findMany()
     * 
     * // Get first 10 DetalleMovimientos
     * const detalleMovimientos = await prisma.detalleMovimiento.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const detalleMovimientoWithIdOnly = await prisma.detalleMovimiento.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DetalleMovimientoFindManyArgs>(args?: SelectSubset<T, DetalleMovimientoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DetalleMovimientoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a DetalleMovimiento.
     * @param {DetalleMovimientoCreateArgs} args - Arguments to create a DetalleMovimiento.
     * @example
     * // Create one DetalleMovimiento
     * const DetalleMovimiento = await prisma.detalleMovimiento.create({
     *   data: {
     *     // ... data to create a DetalleMovimiento
     *   }
     * })
     * 
     */
    create<T extends DetalleMovimientoCreateArgs>(args: SelectSubset<T, DetalleMovimientoCreateArgs<ExtArgs>>): Prisma__DetalleMovimientoClient<$Result.GetResult<Prisma.$DetalleMovimientoPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many DetalleMovimientos.
     * @param {DetalleMovimientoCreateManyArgs} args - Arguments to create many DetalleMovimientos.
     * @example
     * // Create many DetalleMovimientos
     * const detalleMovimiento = await prisma.detalleMovimiento.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DetalleMovimientoCreateManyArgs>(args?: SelectSubset<T, DetalleMovimientoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DetalleMovimientos and returns the data saved in the database.
     * @param {DetalleMovimientoCreateManyAndReturnArgs} args - Arguments to create many DetalleMovimientos.
     * @example
     * // Create many DetalleMovimientos
     * const detalleMovimiento = await prisma.detalleMovimiento.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DetalleMovimientos and only return the `id`
     * const detalleMovimientoWithIdOnly = await prisma.detalleMovimiento.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DetalleMovimientoCreateManyAndReturnArgs>(args?: SelectSubset<T, DetalleMovimientoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DetalleMovimientoPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a DetalleMovimiento.
     * @param {DetalleMovimientoDeleteArgs} args - Arguments to delete one DetalleMovimiento.
     * @example
     * // Delete one DetalleMovimiento
     * const DetalleMovimiento = await prisma.detalleMovimiento.delete({
     *   where: {
     *     // ... filter to delete one DetalleMovimiento
     *   }
     * })
     * 
     */
    delete<T extends DetalleMovimientoDeleteArgs>(args: SelectSubset<T, DetalleMovimientoDeleteArgs<ExtArgs>>): Prisma__DetalleMovimientoClient<$Result.GetResult<Prisma.$DetalleMovimientoPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one DetalleMovimiento.
     * @param {DetalleMovimientoUpdateArgs} args - Arguments to update one DetalleMovimiento.
     * @example
     * // Update one DetalleMovimiento
     * const detalleMovimiento = await prisma.detalleMovimiento.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DetalleMovimientoUpdateArgs>(args: SelectSubset<T, DetalleMovimientoUpdateArgs<ExtArgs>>): Prisma__DetalleMovimientoClient<$Result.GetResult<Prisma.$DetalleMovimientoPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more DetalleMovimientos.
     * @param {DetalleMovimientoDeleteManyArgs} args - Arguments to filter DetalleMovimientos to delete.
     * @example
     * // Delete a few DetalleMovimientos
     * const { count } = await prisma.detalleMovimiento.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DetalleMovimientoDeleteManyArgs>(args?: SelectSubset<T, DetalleMovimientoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DetalleMovimientos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DetalleMovimientoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DetalleMovimientos
     * const detalleMovimiento = await prisma.detalleMovimiento.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DetalleMovimientoUpdateManyArgs>(args: SelectSubset<T, DetalleMovimientoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DetalleMovimientos and returns the data updated in the database.
     * @param {DetalleMovimientoUpdateManyAndReturnArgs} args - Arguments to update many DetalleMovimientos.
     * @example
     * // Update many DetalleMovimientos
     * const detalleMovimiento = await prisma.detalleMovimiento.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more DetalleMovimientos and only return the `id`
     * const detalleMovimientoWithIdOnly = await prisma.detalleMovimiento.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends DetalleMovimientoUpdateManyAndReturnArgs>(args: SelectSubset<T, DetalleMovimientoUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DetalleMovimientoPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one DetalleMovimiento.
     * @param {DetalleMovimientoUpsertArgs} args - Arguments to update or create a DetalleMovimiento.
     * @example
     * // Update or create a DetalleMovimiento
     * const detalleMovimiento = await prisma.detalleMovimiento.upsert({
     *   create: {
     *     // ... data to create a DetalleMovimiento
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DetalleMovimiento we want to update
     *   }
     * })
     */
    upsert<T extends DetalleMovimientoUpsertArgs>(args: SelectSubset<T, DetalleMovimientoUpsertArgs<ExtArgs>>): Prisma__DetalleMovimientoClient<$Result.GetResult<Prisma.$DetalleMovimientoPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of DetalleMovimientos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DetalleMovimientoCountArgs} args - Arguments to filter DetalleMovimientos to count.
     * @example
     * // Count the number of DetalleMovimientos
     * const count = await prisma.detalleMovimiento.count({
     *   where: {
     *     // ... the filter for the DetalleMovimientos we want to count
     *   }
     * })
    **/
    count<T extends DetalleMovimientoCountArgs>(
      args?: Subset<T, DetalleMovimientoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DetalleMovimientoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DetalleMovimiento.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DetalleMovimientoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DetalleMovimientoAggregateArgs>(args: Subset<T, DetalleMovimientoAggregateArgs>): Prisma.PrismaPromise<GetDetalleMovimientoAggregateType<T>>

    /**
     * Group by DetalleMovimiento.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DetalleMovimientoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DetalleMovimientoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DetalleMovimientoGroupByArgs['orderBy'] }
        : { orderBy?: DetalleMovimientoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DetalleMovimientoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDetalleMovimientoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DetalleMovimiento model
   */
  readonly fields: DetalleMovimientoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DetalleMovimiento.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DetalleMovimientoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    movimiento<T extends MovimientoStockDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MovimientoStockDefaultArgs<ExtArgs>>): Prisma__MovimientoStockClient<$Result.GetResult<Prisma.$MovimientoStockPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    stock<T extends StockPorDepositoDefaultArgs<ExtArgs> = {}>(args?: Subset<T, StockPorDepositoDefaultArgs<ExtArgs>>): Prisma__StockPorDepositoClient<$Result.GetResult<Prisma.$StockPorDepositoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the DetalleMovimiento model
   */
  interface DetalleMovimientoFieldRefs {
    readonly id: FieldRef<"DetalleMovimiento", 'Int'>
    readonly movimientoId: FieldRef<"DetalleMovimiento", 'Int'>
    readonly stockId: FieldRef<"DetalleMovimiento", 'Int'>
    readonly cantidad: FieldRef<"DetalleMovimiento", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * DetalleMovimiento findUnique
   */
  export type DetalleMovimientoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DetalleMovimiento
     */
    select?: DetalleMovimientoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DetalleMovimiento
     */
    omit?: DetalleMovimientoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DetalleMovimientoInclude<ExtArgs> | null
    /**
     * Filter, which DetalleMovimiento to fetch.
     */
    where: DetalleMovimientoWhereUniqueInput
  }

  /**
   * DetalleMovimiento findUniqueOrThrow
   */
  export type DetalleMovimientoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DetalleMovimiento
     */
    select?: DetalleMovimientoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DetalleMovimiento
     */
    omit?: DetalleMovimientoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DetalleMovimientoInclude<ExtArgs> | null
    /**
     * Filter, which DetalleMovimiento to fetch.
     */
    where: DetalleMovimientoWhereUniqueInput
  }

  /**
   * DetalleMovimiento findFirst
   */
  export type DetalleMovimientoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DetalleMovimiento
     */
    select?: DetalleMovimientoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DetalleMovimiento
     */
    omit?: DetalleMovimientoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DetalleMovimientoInclude<ExtArgs> | null
    /**
     * Filter, which DetalleMovimiento to fetch.
     */
    where?: DetalleMovimientoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DetalleMovimientos to fetch.
     */
    orderBy?: DetalleMovimientoOrderByWithRelationInput | DetalleMovimientoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DetalleMovimientos.
     */
    cursor?: DetalleMovimientoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DetalleMovimientos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DetalleMovimientos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DetalleMovimientos.
     */
    distinct?: DetalleMovimientoScalarFieldEnum | DetalleMovimientoScalarFieldEnum[]
  }

  /**
   * DetalleMovimiento findFirstOrThrow
   */
  export type DetalleMovimientoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DetalleMovimiento
     */
    select?: DetalleMovimientoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DetalleMovimiento
     */
    omit?: DetalleMovimientoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DetalleMovimientoInclude<ExtArgs> | null
    /**
     * Filter, which DetalleMovimiento to fetch.
     */
    where?: DetalleMovimientoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DetalleMovimientos to fetch.
     */
    orderBy?: DetalleMovimientoOrderByWithRelationInput | DetalleMovimientoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DetalleMovimientos.
     */
    cursor?: DetalleMovimientoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DetalleMovimientos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DetalleMovimientos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DetalleMovimientos.
     */
    distinct?: DetalleMovimientoScalarFieldEnum | DetalleMovimientoScalarFieldEnum[]
  }

  /**
   * DetalleMovimiento findMany
   */
  export type DetalleMovimientoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DetalleMovimiento
     */
    select?: DetalleMovimientoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DetalleMovimiento
     */
    omit?: DetalleMovimientoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DetalleMovimientoInclude<ExtArgs> | null
    /**
     * Filter, which DetalleMovimientos to fetch.
     */
    where?: DetalleMovimientoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DetalleMovimientos to fetch.
     */
    orderBy?: DetalleMovimientoOrderByWithRelationInput | DetalleMovimientoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DetalleMovimientos.
     */
    cursor?: DetalleMovimientoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DetalleMovimientos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DetalleMovimientos.
     */
    skip?: number
    distinct?: DetalleMovimientoScalarFieldEnum | DetalleMovimientoScalarFieldEnum[]
  }

  /**
   * DetalleMovimiento create
   */
  export type DetalleMovimientoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DetalleMovimiento
     */
    select?: DetalleMovimientoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DetalleMovimiento
     */
    omit?: DetalleMovimientoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DetalleMovimientoInclude<ExtArgs> | null
    /**
     * The data needed to create a DetalleMovimiento.
     */
    data: XOR<DetalleMovimientoCreateInput, DetalleMovimientoUncheckedCreateInput>
  }

  /**
   * DetalleMovimiento createMany
   */
  export type DetalleMovimientoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DetalleMovimientos.
     */
    data: DetalleMovimientoCreateManyInput | DetalleMovimientoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DetalleMovimiento createManyAndReturn
   */
  export type DetalleMovimientoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DetalleMovimiento
     */
    select?: DetalleMovimientoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DetalleMovimiento
     */
    omit?: DetalleMovimientoOmit<ExtArgs> | null
    /**
     * The data used to create many DetalleMovimientos.
     */
    data: DetalleMovimientoCreateManyInput | DetalleMovimientoCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DetalleMovimientoIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * DetalleMovimiento update
   */
  export type DetalleMovimientoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DetalleMovimiento
     */
    select?: DetalleMovimientoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DetalleMovimiento
     */
    omit?: DetalleMovimientoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DetalleMovimientoInclude<ExtArgs> | null
    /**
     * The data needed to update a DetalleMovimiento.
     */
    data: XOR<DetalleMovimientoUpdateInput, DetalleMovimientoUncheckedUpdateInput>
    /**
     * Choose, which DetalleMovimiento to update.
     */
    where: DetalleMovimientoWhereUniqueInput
  }

  /**
   * DetalleMovimiento updateMany
   */
  export type DetalleMovimientoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DetalleMovimientos.
     */
    data: XOR<DetalleMovimientoUpdateManyMutationInput, DetalleMovimientoUncheckedUpdateManyInput>
    /**
     * Filter which DetalleMovimientos to update
     */
    where?: DetalleMovimientoWhereInput
    /**
     * Limit how many DetalleMovimientos to update.
     */
    limit?: number
  }

  /**
   * DetalleMovimiento updateManyAndReturn
   */
  export type DetalleMovimientoUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DetalleMovimiento
     */
    select?: DetalleMovimientoSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DetalleMovimiento
     */
    omit?: DetalleMovimientoOmit<ExtArgs> | null
    /**
     * The data used to update DetalleMovimientos.
     */
    data: XOR<DetalleMovimientoUpdateManyMutationInput, DetalleMovimientoUncheckedUpdateManyInput>
    /**
     * Filter which DetalleMovimientos to update
     */
    where?: DetalleMovimientoWhereInput
    /**
     * Limit how many DetalleMovimientos to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DetalleMovimientoIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * DetalleMovimiento upsert
   */
  export type DetalleMovimientoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DetalleMovimiento
     */
    select?: DetalleMovimientoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DetalleMovimiento
     */
    omit?: DetalleMovimientoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DetalleMovimientoInclude<ExtArgs> | null
    /**
     * The filter to search for the DetalleMovimiento to update in case it exists.
     */
    where: DetalleMovimientoWhereUniqueInput
    /**
     * In case the DetalleMovimiento found by the `where` argument doesn't exist, create a new DetalleMovimiento with this data.
     */
    create: XOR<DetalleMovimientoCreateInput, DetalleMovimientoUncheckedCreateInput>
    /**
     * In case the DetalleMovimiento was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DetalleMovimientoUpdateInput, DetalleMovimientoUncheckedUpdateInput>
  }

  /**
   * DetalleMovimiento delete
   */
  export type DetalleMovimientoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DetalleMovimiento
     */
    select?: DetalleMovimientoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DetalleMovimiento
     */
    omit?: DetalleMovimientoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DetalleMovimientoInclude<ExtArgs> | null
    /**
     * Filter which DetalleMovimiento to delete.
     */
    where: DetalleMovimientoWhereUniqueInput
  }

  /**
   * DetalleMovimiento deleteMany
   */
  export type DetalleMovimientoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DetalleMovimientos to delete
     */
    where?: DetalleMovimientoWhereInput
    /**
     * Limit how many DetalleMovimientos to delete.
     */
    limit?: number
  }

  /**
   * DetalleMovimiento without action
   */
  export type DetalleMovimientoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DetalleMovimiento
     */
    select?: DetalleMovimientoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DetalleMovimiento
     */
    omit?: DetalleMovimientoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DetalleMovimientoInclude<ExtArgs> | null
  }


  /**
   * Model TipoComprobante
   */

  export type AggregateTipoComprobante = {
    _count: TipoComprobanteCountAggregateOutputType | null
    _avg: TipoComprobanteAvgAggregateOutputType | null
    _sum: TipoComprobanteSumAggregateOutputType | null
    _min: TipoComprobanteMinAggregateOutputType | null
    _max: TipoComprobanteMaxAggregateOutputType | null
  }

  export type TipoComprobanteAvgAggregateOutputType = {
    id: number | null
  }

  export type TipoComprobanteSumAggregateOutputType = {
    id: number | null
  }

  export type TipoComprobanteMinAggregateOutputType = {
    id: number | null
    nombre: string | null
  }

  export type TipoComprobanteMaxAggregateOutputType = {
    id: number | null
    nombre: string | null
  }

  export type TipoComprobanteCountAggregateOutputType = {
    id: number
    nombre: number
    _all: number
  }


  export type TipoComprobanteAvgAggregateInputType = {
    id?: true
  }

  export type TipoComprobanteSumAggregateInputType = {
    id?: true
  }

  export type TipoComprobanteMinAggregateInputType = {
    id?: true
    nombre?: true
  }

  export type TipoComprobanteMaxAggregateInputType = {
    id?: true
    nombre?: true
  }

  export type TipoComprobanteCountAggregateInputType = {
    id?: true
    nombre?: true
    _all?: true
  }

  export type TipoComprobanteAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TipoComprobante to aggregate.
     */
    where?: TipoComprobanteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TipoComprobantes to fetch.
     */
    orderBy?: TipoComprobanteOrderByWithRelationInput | TipoComprobanteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TipoComprobanteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TipoComprobantes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TipoComprobantes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TipoComprobantes
    **/
    _count?: true | TipoComprobanteCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TipoComprobanteAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TipoComprobanteSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TipoComprobanteMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TipoComprobanteMaxAggregateInputType
  }

  export type GetTipoComprobanteAggregateType<T extends TipoComprobanteAggregateArgs> = {
        [P in keyof T & keyof AggregateTipoComprobante]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTipoComprobante[P]>
      : GetScalarType<T[P], AggregateTipoComprobante[P]>
  }




  export type TipoComprobanteGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TipoComprobanteWhereInput
    orderBy?: TipoComprobanteOrderByWithAggregationInput | TipoComprobanteOrderByWithAggregationInput[]
    by: TipoComprobanteScalarFieldEnum[] | TipoComprobanteScalarFieldEnum
    having?: TipoComprobanteScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TipoComprobanteCountAggregateInputType | true
    _avg?: TipoComprobanteAvgAggregateInputType
    _sum?: TipoComprobanteSumAggregateInputType
    _min?: TipoComprobanteMinAggregateInputType
    _max?: TipoComprobanteMaxAggregateInputType
  }

  export type TipoComprobanteGroupByOutputType = {
    id: number
    nombre: string
    _count: TipoComprobanteCountAggregateOutputType | null
    _avg: TipoComprobanteAvgAggregateOutputType | null
    _sum: TipoComprobanteSumAggregateOutputType | null
    _min: TipoComprobanteMinAggregateOutputType | null
    _max: TipoComprobanteMaxAggregateOutputType | null
  }

  type GetTipoComprobanteGroupByPayload<T extends TipoComprobanteGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TipoComprobanteGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TipoComprobanteGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TipoComprobanteGroupByOutputType[P]>
            : GetScalarType<T[P], TipoComprobanteGroupByOutputType[P]>
        }
      >
    >


  export type TipoComprobanteSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    movimientos?: boolean | TipoComprobante$movimientosArgs<ExtArgs>
    _count?: boolean | TipoComprobanteCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tipoComprobante"]>

  export type TipoComprobanteSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
  }, ExtArgs["result"]["tipoComprobante"]>

  export type TipoComprobanteSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
  }, ExtArgs["result"]["tipoComprobante"]>

  export type TipoComprobanteSelectScalar = {
    id?: boolean
    nombre?: boolean
  }

  export type TipoComprobanteOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "nombre", ExtArgs["result"]["tipoComprobante"]>
  export type TipoComprobanteInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    movimientos?: boolean | TipoComprobante$movimientosArgs<ExtArgs>
    _count?: boolean | TipoComprobanteCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TipoComprobanteIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type TipoComprobanteIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $TipoComprobantePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TipoComprobante"
    objects: {
      movimientos: Prisma.$MovimientoStockPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      nombre: string
    }, ExtArgs["result"]["tipoComprobante"]>
    composites: {}
  }

  type TipoComprobanteGetPayload<S extends boolean | null | undefined | TipoComprobanteDefaultArgs> = $Result.GetResult<Prisma.$TipoComprobantePayload, S>

  type TipoComprobanteCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TipoComprobanteFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TipoComprobanteCountAggregateInputType | true
    }

  export interface TipoComprobanteDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TipoComprobante'], meta: { name: 'TipoComprobante' } }
    /**
     * Find zero or one TipoComprobante that matches the filter.
     * @param {TipoComprobanteFindUniqueArgs} args - Arguments to find a TipoComprobante
     * @example
     * // Get one TipoComprobante
     * const tipoComprobante = await prisma.tipoComprobante.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TipoComprobanteFindUniqueArgs>(args: SelectSubset<T, TipoComprobanteFindUniqueArgs<ExtArgs>>): Prisma__TipoComprobanteClient<$Result.GetResult<Prisma.$TipoComprobantePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TipoComprobante that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TipoComprobanteFindUniqueOrThrowArgs} args - Arguments to find a TipoComprobante
     * @example
     * // Get one TipoComprobante
     * const tipoComprobante = await prisma.tipoComprobante.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TipoComprobanteFindUniqueOrThrowArgs>(args: SelectSubset<T, TipoComprobanteFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TipoComprobanteClient<$Result.GetResult<Prisma.$TipoComprobantePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TipoComprobante that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TipoComprobanteFindFirstArgs} args - Arguments to find a TipoComprobante
     * @example
     * // Get one TipoComprobante
     * const tipoComprobante = await prisma.tipoComprobante.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TipoComprobanteFindFirstArgs>(args?: SelectSubset<T, TipoComprobanteFindFirstArgs<ExtArgs>>): Prisma__TipoComprobanteClient<$Result.GetResult<Prisma.$TipoComprobantePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TipoComprobante that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TipoComprobanteFindFirstOrThrowArgs} args - Arguments to find a TipoComprobante
     * @example
     * // Get one TipoComprobante
     * const tipoComprobante = await prisma.tipoComprobante.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TipoComprobanteFindFirstOrThrowArgs>(args?: SelectSubset<T, TipoComprobanteFindFirstOrThrowArgs<ExtArgs>>): Prisma__TipoComprobanteClient<$Result.GetResult<Prisma.$TipoComprobantePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TipoComprobantes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TipoComprobanteFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TipoComprobantes
     * const tipoComprobantes = await prisma.tipoComprobante.findMany()
     * 
     * // Get first 10 TipoComprobantes
     * const tipoComprobantes = await prisma.tipoComprobante.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tipoComprobanteWithIdOnly = await prisma.tipoComprobante.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TipoComprobanteFindManyArgs>(args?: SelectSubset<T, TipoComprobanteFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TipoComprobantePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TipoComprobante.
     * @param {TipoComprobanteCreateArgs} args - Arguments to create a TipoComprobante.
     * @example
     * // Create one TipoComprobante
     * const TipoComprobante = await prisma.tipoComprobante.create({
     *   data: {
     *     // ... data to create a TipoComprobante
     *   }
     * })
     * 
     */
    create<T extends TipoComprobanteCreateArgs>(args: SelectSubset<T, TipoComprobanteCreateArgs<ExtArgs>>): Prisma__TipoComprobanteClient<$Result.GetResult<Prisma.$TipoComprobantePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TipoComprobantes.
     * @param {TipoComprobanteCreateManyArgs} args - Arguments to create many TipoComprobantes.
     * @example
     * // Create many TipoComprobantes
     * const tipoComprobante = await prisma.tipoComprobante.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TipoComprobanteCreateManyArgs>(args?: SelectSubset<T, TipoComprobanteCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TipoComprobantes and returns the data saved in the database.
     * @param {TipoComprobanteCreateManyAndReturnArgs} args - Arguments to create many TipoComprobantes.
     * @example
     * // Create many TipoComprobantes
     * const tipoComprobante = await prisma.tipoComprobante.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TipoComprobantes and only return the `id`
     * const tipoComprobanteWithIdOnly = await prisma.tipoComprobante.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TipoComprobanteCreateManyAndReturnArgs>(args?: SelectSubset<T, TipoComprobanteCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TipoComprobantePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TipoComprobante.
     * @param {TipoComprobanteDeleteArgs} args - Arguments to delete one TipoComprobante.
     * @example
     * // Delete one TipoComprobante
     * const TipoComprobante = await prisma.tipoComprobante.delete({
     *   where: {
     *     // ... filter to delete one TipoComprobante
     *   }
     * })
     * 
     */
    delete<T extends TipoComprobanteDeleteArgs>(args: SelectSubset<T, TipoComprobanteDeleteArgs<ExtArgs>>): Prisma__TipoComprobanteClient<$Result.GetResult<Prisma.$TipoComprobantePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TipoComprobante.
     * @param {TipoComprobanteUpdateArgs} args - Arguments to update one TipoComprobante.
     * @example
     * // Update one TipoComprobante
     * const tipoComprobante = await prisma.tipoComprobante.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TipoComprobanteUpdateArgs>(args: SelectSubset<T, TipoComprobanteUpdateArgs<ExtArgs>>): Prisma__TipoComprobanteClient<$Result.GetResult<Prisma.$TipoComprobantePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TipoComprobantes.
     * @param {TipoComprobanteDeleteManyArgs} args - Arguments to filter TipoComprobantes to delete.
     * @example
     * // Delete a few TipoComprobantes
     * const { count } = await prisma.tipoComprobante.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TipoComprobanteDeleteManyArgs>(args?: SelectSubset<T, TipoComprobanteDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TipoComprobantes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TipoComprobanteUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TipoComprobantes
     * const tipoComprobante = await prisma.tipoComprobante.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TipoComprobanteUpdateManyArgs>(args: SelectSubset<T, TipoComprobanteUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TipoComprobantes and returns the data updated in the database.
     * @param {TipoComprobanteUpdateManyAndReturnArgs} args - Arguments to update many TipoComprobantes.
     * @example
     * // Update many TipoComprobantes
     * const tipoComprobante = await prisma.tipoComprobante.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TipoComprobantes and only return the `id`
     * const tipoComprobanteWithIdOnly = await prisma.tipoComprobante.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TipoComprobanteUpdateManyAndReturnArgs>(args: SelectSubset<T, TipoComprobanteUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TipoComprobantePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TipoComprobante.
     * @param {TipoComprobanteUpsertArgs} args - Arguments to update or create a TipoComprobante.
     * @example
     * // Update or create a TipoComprobante
     * const tipoComprobante = await prisma.tipoComprobante.upsert({
     *   create: {
     *     // ... data to create a TipoComprobante
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TipoComprobante we want to update
     *   }
     * })
     */
    upsert<T extends TipoComprobanteUpsertArgs>(args: SelectSubset<T, TipoComprobanteUpsertArgs<ExtArgs>>): Prisma__TipoComprobanteClient<$Result.GetResult<Prisma.$TipoComprobantePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TipoComprobantes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TipoComprobanteCountArgs} args - Arguments to filter TipoComprobantes to count.
     * @example
     * // Count the number of TipoComprobantes
     * const count = await prisma.tipoComprobante.count({
     *   where: {
     *     // ... the filter for the TipoComprobantes we want to count
     *   }
     * })
    **/
    count<T extends TipoComprobanteCountArgs>(
      args?: Subset<T, TipoComprobanteCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TipoComprobanteCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TipoComprobante.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TipoComprobanteAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TipoComprobanteAggregateArgs>(args: Subset<T, TipoComprobanteAggregateArgs>): Prisma.PrismaPromise<GetTipoComprobanteAggregateType<T>>

    /**
     * Group by TipoComprobante.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TipoComprobanteGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TipoComprobanteGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TipoComprobanteGroupByArgs['orderBy'] }
        : { orderBy?: TipoComprobanteGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TipoComprobanteGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTipoComprobanteGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TipoComprobante model
   */
  readonly fields: TipoComprobanteFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TipoComprobante.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TipoComprobanteClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    movimientos<T extends TipoComprobante$movimientosArgs<ExtArgs> = {}>(args?: Subset<T, TipoComprobante$movimientosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MovimientoStockPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TipoComprobante model
   */
  interface TipoComprobanteFieldRefs {
    readonly id: FieldRef<"TipoComprobante", 'Int'>
    readonly nombre: FieldRef<"TipoComprobante", 'String'>
  }
    

  // Custom InputTypes
  /**
   * TipoComprobante findUnique
   */
  export type TipoComprobanteFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TipoComprobante
     */
    select?: TipoComprobanteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TipoComprobante
     */
    omit?: TipoComprobanteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TipoComprobanteInclude<ExtArgs> | null
    /**
     * Filter, which TipoComprobante to fetch.
     */
    where: TipoComprobanteWhereUniqueInput
  }

  /**
   * TipoComprobante findUniqueOrThrow
   */
  export type TipoComprobanteFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TipoComprobante
     */
    select?: TipoComprobanteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TipoComprobante
     */
    omit?: TipoComprobanteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TipoComprobanteInclude<ExtArgs> | null
    /**
     * Filter, which TipoComprobante to fetch.
     */
    where: TipoComprobanteWhereUniqueInput
  }

  /**
   * TipoComprobante findFirst
   */
  export type TipoComprobanteFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TipoComprobante
     */
    select?: TipoComprobanteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TipoComprobante
     */
    omit?: TipoComprobanteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TipoComprobanteInclude<ExtArgs> | null
    /**
     * Filter, which TipoComprobante to fetch.
     */
    where?: TipoComprobanteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TipoComprobantes to fetch.
     */
    orderBy?: TipoComprobanteOrderByWithRelationInput | TipoComprobanteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TipoComprobantes.
     */
    cursor?: TipoComprobanteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TipoComprobantes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TipoComprobantes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TipoComprobantes.
     */
    distinct?: TipoComprobanteScalarFieldEnum | TipoComprobanteScalarFieldEnum[]
  }

  /**
   * TipoComprobante findFirstOrThrow
   */
  export type TipoComprobanteFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TipoComprobante
     */
    select?: TipoComprobanteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TipoComprobante
     */
    omit?: TipoComprobanteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TipoComprobanteInclude<ExtArgs> | null
    /**
     * Filter, which TipoComprobante to fetch.
     */
    where?: TipoComprobanteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TipoComprobantes to fetch.
     */
    orderBy?: TipoComprobanteOrderByWithRelationInput | TipoComprobanteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TipoComprobantes.
     */
    cursor?: TipoComprobanteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TipoComprobantes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TipoComprobantes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TipoComprobantes.
     */
    distinct?: TipoComprobanteScalarFieldEnum | TipoComprobanteScalarFieldEnum[]
  }

  /**
   * TipoComprobante findMany
   */
  export type TipoComprobanteFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TipoComprobante
     */
    select?: TipoComprobanteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TipoComprobante
     */
    omit?: TipoComprobanteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TipoComprobanteInclude<ExtArgs> | null
    /**
     * Filter, which TipoComprobantes to fetch.
     */
    where?: TipoComprobanteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TipoComprobantes to fetch.
     */
    orderBy?: TipoComprobanteOrderByWithRelationInput | TipoComprobanteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TipoComprobantes.
     */
    cursor?: TipoComprobanteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TipoComprobantes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TipoComprobantes.
     */
    skip?: number
    distinct?: TipoComprobanteScalarFieldEnum | TipoComprobanteScalarFieldEnum[]
  }

  /**
   * TipoComprobante create
   */
  export type TipoComprobanteCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TipoComprobante
     */
    select?: TipoComprobanteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TipoComprobante
     */
    omit?: TipoComprobanteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TipoComprobanteInclude<ExtArgs> | null
    /**
     * The data needed to create a TipoComprobante.
     */
    data: XOR<TipoComprobanteCreateInput, TipoComprobanteUncheckedCreateInput>
  }

  /**
   * TipoComprobante createMany
   */
  export type TipoComprobanteCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TipoComprobantes.
     */
    data: TipoComprobanteCreateManyInput | TipoComprobanteCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TipoComprobante createManyAndReturn
   */
  export type TipoComprobanteCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TipoComprobante
     */
    select?: TipoComprobanteSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TipoComprobante
     */
    omit?: TipoComprobanteOmit<ExtArgs> | null
    /**
     * The data used to create many TipoComprobantes.
     */
    data: TipoComprobanteCreateManyInput | TipoComprobanteCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TipoComprobante update
   */
  export type TipoComprobanteUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TipoComprobante
     */
    select?: TipoComprobanteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TipoComprobante
     */
    omit?: TipoComprobanteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TipoComprobanteInclude<ExtArgs> | null
    /**
     * The data needed to update a TipoComprobante.
     */
    data: XOR<TipoComprobanteUpdateInput, TipoComprobanteUncheckedUpdateInput>
    /**
     * Choose, which TipoComprobante to update.
     */
    where: TipoComprobanteWhereUniqueInput
  }

  /**
   * TipoComprobante updateMany
   */
  export type TipoComprobanteUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TipoComprobantes.
     */
    data: XOR<TipoComprobanteUpdateManyMutationInput, TipoComprobanteUncheckedUpdateManyInput>
    /**
     * Filter which TipoComprobantes to update
     */
    where?: TipoComprobanteWhereInput
    /**
     * Limit how many TipoComprobantes to update.
     */
    limit?: number
  }

  /**
   * TipoComprobante updateManyAndReturn
   */
  export type TipoComprobanteUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TipoComprobante
     */
    select?: TipoComprobanteSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TipoComprobante
     */
    omit?: TipoComprobanteOmit<ExtArgs> | null
    /**
     * The data used to update TipoComprobantes.
     */
    data: XOR<TipoComprobanteUpdateManyMutationInput, TipoComprobanteUncheckedUpdateManyInput>
    /**
     * Filter which TipoComprobantes to update
     */
    where?: TipoComprobanteWhereInput
    /**
     * Limit how many TipoComprobantes to update.
     */
    limit?: number
  }

  /**
   * TipoComprobante upsert
   */
  export type TipoComprobanteUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TipoComprobante
     */
    select?: TipoComprobanteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TipoComprobante
     */
    omit?: TipoComprobanteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TipoComprobanteInclude<ExtArgs> | null
    /**
     * The filter to search for the TipoComprobante to update in case it exists.
     */
    where: TipoComprobanteWhereUniqueInput
    /**
     * In case the TipoComprobante found by the `where` argument doesn't exist, create a new TipoComprobante with this data.
     */
    create: XOR<TipoComprobanteCreateInput, TipoComprobanteUncheckedCreateInput>
    /**
     * In case the TipoComprobante was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TipoComprobanteUpdateInput, TipoComprobanteUncheckedUpdateInput>
  }

  /**
   * TipoComprobante delete
   */
  export type TipoComprobanteDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TipoComprobante
     */
    select?: TipoComprobanteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TipoComprobante
     */
    omit?: TipoComprobanteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TipoComprobanteInclude<ExtArgs> | null
    /**
     * Filter which TipoComprobante to delete.
     */
    where: TipoComprobanteWhereUniqueInput
  }

  /**
   * TipoComprobante deleteMany
   */
  export type TipoComprobanteDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TipoComprobantes to delete
     */
    where?: TipoComprobanteWhereInput
    /**
     * Limit how many TipoComprobantes to delete.
     */
    limit?: number
  }

  /**
   * TipoComprobante.movimientos
   */
  export type TipoComprobante$movimientosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MovimientoStock
     */
    select?: MovimientoStockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MovimientoStock
     */
    omit?: MovimientoStockOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MovimientoStockInclude<ExtArgs> | null
    where?: MovimientoStockWhereInput
    orderBy?: MovimientoStockOrderByWithRelationInput | MovimientoStockOrderByWithRelationInput[]
    cursor?: MovimientoStockWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MovimientoStockScalarFieldEnum | MovimientoStockScalarFieldEnum[]
  }

  /**
   * TipoComprobante without action
   */
  export type TipoComprobanteDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TipoComprobante
     */
    select?: TipoComprobanteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TipoComprobante
     */
    omit?: TipoComprobanteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TipoComprobanteInclude<ExtArgs> | null
  }


  /**
   * Model TipoMovimiento
   */

  export type AggregateTipoMovimiento = {
    _count: TipoMovimientoCountAggregateOutputType | null
    _avg: TipoMovimientoAvgAggregateOutputType | null
    _sum: TipoMovimientoSumAggregateOutputType | null
    _min: TipoMovimientoMinAggregateOutputType | null
    _max: TipoMovimientoMaxAggregateOutputType | null
  }

  export type TipoMovimientoAvgAggregateOutputType = {
    id: number | null
  }

  export type TipoMovimientoSumAggregateOutputType = {
    id: number | null
  }

  export type TipoMovimientoMinAggregateOutputType = {
    id: number | null
    nombre: string | null
    ingresoEgreso: boolean | null
  }

  export type TipoMovimientoMaxAggregateOutputType = {
    id: number | null
    nombre: string | null
    ingresoEgreso: boolean | null
  }

  export type TipoMovimientoCountAggregateOutputType = {
    id: number
    nombre: number
    ingresoEgreso: number
    _all: number
  }


  export type TipoMovimientoAvgAggregateInputType = {
    id?: true
  }

  export type TipoMovimientoSumAggregateInputType = {
    id?: true
  }

  export type TipoMovimientoMinAggregateInputType = {
    id?: true
    nombre?: true
    ingresoEgreso?: true
  }

  export type TipoMovimientoMaxAggregateInputType = {
    id?: true
    nombre?: true
    ingresoEgreso?: true
  }

  export type TipoMovimientoCountAggregateInputType = {
    id?: true
    nombre?: true
    ingresoEgreso?: true
    _all?: true
  }

  export type TipoMovimientoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TipoMovimiento to aggregate.
     */
    where?: TipoMovimientoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TipoMovimientos to fetch.
     */
    orderBy?: TipoMovimientoOrderByWithRelationInput | TipoMovimientoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TipoMovimientoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TipoMovimientos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TipoMovimientos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TipoMovimientos
    **/
    _count?: true | TipoMovimientoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TipoMovimientoAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TipoMovimientoSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TipoMovimientoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TipoMovimientoMaxAggregateInputType
  }

  export type GetTipoMovimientoAggregateType<T extends TipoMovimientoAggregateArgs> = {
        [P in keyof T & keyof AggregateTipoMovimiento]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTipoMovimiento[P]>
      : GetScalarType<T[P], AggregateTipoMovimiento[P]>
  }




  export type TipoMovimientoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TipoMovimientoWhereInput
    orderBy?: TipoMovimientoOrderByWithAggregationInput | TipoMovimientoOrderByWithAggregationInput[]
    by: TipoMovimientoScalarFieldEnum[] | TipoMovimientoScalarFieldEnum
    having?: TipoMovimientoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TipoMovimientoCountAggregateInputType | true
    _avg?: TipoMovimientoAvgAggregateInputType
    _sum?: TipoMovimientoSumAggregateInputType
    _min?: TipoMovimientoMinAggregateInputType
    _max?: TipoMovimientoMaxAggregateInputType
  }

  export type TipoMovimientoGroupByOutputType = {
    id: number
    nombre: string
    ingresoEgreso: boolean
    _count: TipoMovimientoCountAggregateOutputType | null
    _avg: TipoMovimientoAvgAggregateOutputType | null
    _sum: TipoMovimientoSumAggregateOutputType | null
    _min: TipoMovimientoMinAggregateOutputType | null
    _max: TipoMovimientoMaxAggregateOutputType | null
  }

  type GetTipoMovimientoGroupByPayload<T extends TipoMovimientoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TipoMovimientoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TipoMovimientoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TipoMovimientoGroupByOutputType[P]>
            : GetScalarType<T[P], TipoMovimientoGroupByOutputType[P]>
        }
      >
    >


  export type TipoMovimientoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    ingresoEgreso?: boolean
    movimientos?: boolean | TipoMovimiento$movimientosArgs<ExtArgs>
    _count?: boolean | TipoMovimientoCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tipoMovimiento"]>

  export type TipoMovimientoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    ingresoEgreso?: boolean
  }, ExtArgs["result"]["tipoMovimiento"]>

  export type TipoMovimientoSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    ingresoEgreso?: boolean
  }, ExtArgs["result"]["tipoMovimiento"]>

  export type TipoMovimientoSelectScalar = {
    id?: boolean
    nombre?: boolean
    ingresoEgreso?: boolean
  }

  export type TipoMovimientoOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "nombre" | "ingresoEgreso", ExtArgs["result"]["tipoMovimiento"]>
  export type TipoMovimientoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    movimientos?: boolean | TipoMovimiento$movimientosArgs<ExtArgs>
    _count?: boolean | TipoMovimientoCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TipoMovimientoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type TipoMovimientoIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $TipoMovimientoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TipoMovimiento"
    objects: {
      movimientos: Prisma.$MovimientoStockPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      nombre: string
      ingresoEgreso: boolean
    }, ExtArgs["result"]["tipoMovimiento"]>
    composites: {}
  }

  type TipoMovimientoGetPayload<S extends boolean | null | undefined | TipoMovimientoDefaultArgs> = $Result.GetResult<Prisma.$TipoMovimientoPayload, S>

  type TipoMovimientoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TipoMovimientoFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TipoMovimientoCountAggregateInputType | true
    }

  export interface TipoMovimientoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TipoMovimiento'], meta: { name: 'TipoMovimiento' } }
    /**
     * Find zero or one TipoMovimiento that matches the filter.
     * @param {TipoMovimientoFindUniqueArgs} args - Arguments to find a TipoMovimiento
     * @example
     * // Get one TipoMovimiento
     * const tipoMovimiento = await prisma.tipoMovimiento.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TipoMovimientoFindUniqueArgs>(args: SelectSubset<T, TipoMovimientoFindUniqueArgs<ExtArgs>>): Prisma__TipoMovimientoClient<$Result.GetResult<Prisma.$TipoMovimientoPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TipoMovimiento that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TipoMovimientoFindUniqueOrThrowArgs} args - Arguments to find a TipoMovimiento
     * @example
     * // Get one TipoMovimiento
     * const tipoMovimiento = await prisma.tipoMovimiento.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TipoMovimientoFindUniqueOrThrowArgs>(args: SelectSubset<T, TipoMovimientoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TipoMovimientoClient<$Result.GetResult<Prisma.$TipoMovimientoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TipoMovimiento that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TipoMovimientoFindFirstArgs} args - Arguments to find a TipoMovimiento
     * @example
     * // Get one TipoMovimiento
     * const tipoMovimiento = await prisma.tipoMovimiento.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TipoMovimientoFindFirstArgs>(args?: SelectSubset<T, TipoMovimientoFindFirstArgs<ExtArgs>>): Prisma__TipoMovimientoClient<$Result.GetResult<Prisma.$TipoMovimientoPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TipoMovimiento that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TipoMovimientoFindFirstOrThrowArgs} args - Arguments to find a TipoMovimiento
     * @example
     * // Get one TipoMovimiento
     * const tipoMovimiento = await prisma.tipoMovimiento.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TipoMovimientoFindFirstOrThrowArgs>(args?: SelectSubset<T, TipoMovimientoFindFirstOrThrowArgs<ExtArgs>>): Prisma__TipoMovimientoClient<$Result.GetResult<Prisma.$TipoMovimientoPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TipoMovimientos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TipoMovimientoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TipoMovimientos
     * const tipoMovimientos = await prisma.tipoMovimiento.findMany()
     * 
     * // Get first 10 TipoMovimientos
     * const tipoMovimientos = await prisma.tipoMovimiento.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tipoMovimientoWithIdOnly = await prisma.tipoMovimiento.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TipoMovimientoFindManyArgs>(args?: SelectSubset<T, TipoMovimientoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TipoMovimientoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TipoMovimiento.
     * @param {TipoMovimientoCreateArgs} args - Arguments to create a TipoMovimiento.
     * @example
     * // Create one TipoMovimiento
     * const TipoMovimiento = await prisma.tipoMovimiento.create({
     *   data: {
     *     // ... data to create a TipoMovimiento
     *   }
     * })
     * 
     */
    create<T extends TipoMovimientoCreateArgs>(args: SelectSubset<T, TipoMovimientoCreateArgs<ExtArgs>>): Prisma__TipoMovimientoClient<$Result.GetResult<Prisma.$TipoMovimientoPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TipoMovimientos.
     * @param {TipoMovimientoCreateManyArgs} args - Arguments to create many TipoMovimientos.
     * @example
     * // Create many TipoMovimientos
     * const tipoMovimiento = await prisma.tipoMovimiento.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TipoMovimientoCreateManyArgs>(args?: SelectSubset<T, TipoMovimientoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TipoMovimientos and returns the data saved in the database.
     * @param {TipoMovimientoCreateManyAndReturnArgs} args - Arguments to create many TipoMovimientos.
     * @example
     * // Create many TipoMovimientos
     * const tipoMovimiento = await prisma.tipoMovimiento.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TipoMovimientos and only return the `id`
     * const tipoMovimientoWithIdOnly = await prisma.tipoMovimiento.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TipoMovimientoCreateManyAndReturnArgs>(args?: SelectSubset<T, TipoMovimientoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TipoMovimientoPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TipoMovimiento.
     * @param {TipoMovimientoDeleteArgs} args - Arguments to delete one TipoMovimiento.
     * @example
     * // Delete one TipoMovimiento
     * const TipoMovimiento = await prisma.tipoMovimiento.delete({
     *   where: {
     *     // ... filter to delete one TipoMovimiento
     *   }
     * })
     * 
     */
    delete<T extends TipoMovimientoDeleteArgs>(args: SelectSubset<T, TipoMovimientoDeleteArgs<ExtArgs>>): Prisma__TipoMovimientoClient<$Result.GetResult<Prisma.$TipoMovimientoPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TipoMovimiento.
     * @param {TipoMovimientoUpdateArgs} args - Arguments to update one TipoMovimiento.
     * @example
     * // Update one TipoMovimiento
     * const tipoMovimiento = await prisma.tipoMovimiento.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TipoMovimientoUpdateArgs>(args: SelectSubset<T, TipoMovimientoUpdateArgs<ExtArgs>>): Prisma__TipoMovimientoClient<$Result.GetResult<Prisma.$TipoMovimientoPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TipoMovimientos.
     * @param {TipoMovimientoDeleteManyArgs} args - Arguments to filter TipoMovimientos to delete.
     * @example
     * // Delete a few TipoMovimientos
     * const { count } = await prisma.tipoMovimiento.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TipoMovimientoDeleteManyArgs>(args?: SelectSubset<T, TipoMovimientoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TipoMovimientos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TipoMovimientoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TipoMovimientos
     * const tipoMovimiento = await prisma.tipoMovimiento.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TipoMovimientoUpdateManyArgs>(args: SelectSubset<T, TipoMovimientoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TipoMovimientos and returns the data updated in the database.
     * @param {TipoMovimientoUpdateManyAndReturnArgs} args - Arguments to update many TipoMovimientos.
     * @example
     * // Update many TipoMovimientos
     * const tipoMovimiento = await prisma.tipoMovimiento.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TipoMovimientos and only return the `id`
     * const tipoMovimientoWithIdOnly = await prisma.tipoMovimiento.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TipoMovimientoUpdateManyAndReturnArgs>(args: SelectSubset<T, TipoMovimientoUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TipoMovimientoPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TipoMovimiento.
     * @param {TipoMovimientoUpsertArgs} args - Arguments to update or create a TipoMovimiento.
     * @example
     * // Update or create a TipoMovimiento
     * const tipoMovimiento = await prisma.tipoMovimiento.upsert({
     *   create: {
     *     // ... data to create a TipoMovimiento
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TipoMovimiento we want to update
     *   }
     * })
     */
    upsert<T extends TipoMovimientoUpsertArgs>(args: SelectSubset<T, TipoMovimientoUpsertArgs<ExtArgs>>): Prisma__TipoMovimientoClient<$Result.GetResult<Prisma.$TipoMovimientoPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TipoMovimientos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TipoMovimientoCountArgs} args - Arguments to filter TipoMovimientos to count.
     * @example
     * // Count the number of TipoMovimientos
     * const count = await prisma.tipoMovimiento.count({
     *   where: {
     *     // ... the filter for the TipoMovimientos we want to count
     *   }
     * })
    **/
    count<T extends TipoMovimientoCountArgs>(
      args?: Subset<T, TipoMovimientoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TipoMovimientoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TipoMovimiento.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TipoMovimientoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TipoMovimientoAggregateArgs>(args: Subset<T, TipoMovimientoAggregateArgs>): Prisma.PrismaPromise<GetTipoMovimientoAggregateType<T>>

    /**
     * Group by TipoMovimiento.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TipoMovimientoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TipoMovimientoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TipoMovimientoGroupByArgs['orderBy'] }
        : { orderBy?: TipoMovimientoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TipoMovimientoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTipoMovimientoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TipoMovimiento model
   */
  readonly fields: TipoMovimientoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TipoMovimiento.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TipoMovimientoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    movimientos<T extends TipoMovimiento$movimientosArgs<ExtArgs> = {}>(args?: Subset<T, TipoMovimiento$movimientosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MovimientoStockPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TipoMovimiento model
   */
  interface TipoMovimientoFieldRefs {
    readonly id: FieldRef<"TipoMovimiento", 'Int'>
    readonly nombre: FieldRef<"TipoMovimiento", 'String'>
    readonly ingresoEgreso: FieldRef<"TipoMovimiento", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * TipoMovimiento findUnique
   */
  export type TipoMovimientoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TipoMovimiento
     */
    select?: TipoMovimientoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TipoMovimiento
     */
    omit?: TipoMovimientoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TipoMovimientoInclude<ExtArgs> | null
    /**
     * Filter, which TipoMovimiento to fetch.
     */
    where: TipoMovimientoWhereUniqueInput
  }

  /**
   * TipoMovimiento findUniqueOrThrow
   */
  export type TipoMovimientoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TipoMovimiento
     */
    select?: TipoMovimientoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TipoMovimiento
     */
    omit?: TipoMovimientoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TipoMovimientoInclude<ExtArgs> | null
    /**
     * Filter, which TipoMovimiento to fetch.
     */
    where: TipoMovimientoWhereUniqueInput
  }

  /**
   * TipoMovimiento findFirst
   */
  export type TipoMovimientoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TipoMovimiento
     */
    select?: TipoMovimientoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TipoMovimiento
     */
    omit?: TipoMovimientoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TipoMovimientoInclude<ExtArgs> | null
    /**
     * Filter, which TipoMovimiento to fetch.
     */
    where?: TipoMovimientoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TipoMovimientos to fetch.
     */
    orderBy?: TipoMovimientoOrderByWithRelationInput | TipoMovimientoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TipoMovimientos.
     */
    cursor?: TipoMovimientoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TipoMovimientos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TipoMovimientos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TipoMovimientos.
     */
    distinct?: TipoMovimientoScalarFieldEnum | TipoMovimientoScalarFieldEnum[]
  }

  /**
   * TipoMovimiento findFirstOrThrow
   */
  export type TipoMovimientoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TipoMovimiento
     */
    select?: TipoMovimientoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TipoMovimiento
     */
    omit?: TipoMovimientoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TipoMovimientoInclude<ExtArgs> | null
    /**
     * Filter, which TipoMovimiento to fetch.
     */
    where?: TipoMovimientoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TipoMovimientos to fetch.
     */
    orderBy?: TipoMovimientoOrderByWithRelationInput | TipoMovimientoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TipoMovimientos.
     */
    cursor?: TipoMovimientoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TipoMovimientos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TipoMovimientos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TipoMovimientos.
     */
    distinct?: TipoMovimientoScalarFieldEnum | TipoMovimientoScalarFieldEnum[]
  }

  /**
   * TipoMovimiento findMany
   */
  export type TipoMovimientoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TipoMovimiento
     */
    select?: TipoMovimientoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TipoMovimiento
     */
    omit?: TipoMovimientoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TipoMovimientoInclude<ExtArgs> | null
    /**
     * Filter, which TipoMovimientos to fetch.
     */
    where?: TipoMovimientoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TipoMovimientos to fetch.
     */
    orderBy?: TipoMovimientoOrderByWithRelationInput | TipoMovimientoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TipoMovimientos.
     */
    cursor?: TipoMovimientoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TipoMovimientos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TipoMovimientos.
     */
    skip?: number
    distinct?: TipoMovimientoScalarFieldEnum | TipoMovimientoScalarFieldEnum[]
  }

  /**
   * TipoMovimiento create
   */
  export type TipoMovimientoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TipoMovimiento
     */
    select?: TipoMovimientoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TipoMovimiento
     */
    omit?: TipoMovimientoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TipoMovimientoInclude<ExtArgs> | null
    /**
     * The data needed to create a TipoMovimiento.
     */
    data: XOR<TipoMovimientoCreateInput, TipoMovimientoUncheckedCreateInput>
  }

  /**
   * TipoMovimiento createMany
   */
  export type TipoMovimientoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TipoMovimientos.
     */
    data: TipoMovimientoCreateManyInput | TipoMovimientoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TipoMovimiento createManyAndReturn
   */
  export type TipoMovimientoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TipoMovimiento
     */
    select?: TipoMovimientoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TipoMovimiento
     */
    omit?: TipoMovimientoOmit<ExtArgs> | null
    /**
     * The data used to create many TipoMovimientos.
     */
    data: TipoMovimientoCreateManyInput | TipoMovimientoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TipoMovimiento update
   */
  export type TipoMovimientoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TipoMovimiento
     */
    select?: TipoMovimientoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TipoMovimiento
     */
    omit?: TipoMovimientoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TipoMovimientoInclude<ExtArgs> | null
    /**
     * The data needed to update a TipoMovimiento.
     */
    data: XOR<TipoMovimientoUpdateInput, TipoMovimientoUncheckedUpdateInput>
    /**
     * Choose, which TipoMovimiento to update.
     */
    where: TipoMovimientoWhereUniqueInput
  }

  /**
   * TipoMovimiento updateMany
   */
  export type TipoMovimientoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TipoMovimientos.
     */
    data: XOR<TipoMovimientoUpdateManyMutationInput, TipoMovimientoUncheckedUpdateManyInput>
    /**
     * Filter which TipoMovimientos to update
     */
    where?: TipoMovimientoWhereInput
    /**
     * Limit how many TipoMovimientos to update.
     */
    limit?: number
  }

  /**
   * TipoMovimiento updateManyAndReturn
   */
  export type TipoMovimientoUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TipoMovimiento
     */
    select?: TipoMovimientoSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TipoMovimiento
     */
    omit?: TipoMovimientoOmit<ExtArgs> | null
    /**
     * The data used to update TipoMovimientos.
     */
    data: XOR<TipoMovimientoUpdateManyMutationInput, TipoMovimientoUncheckedUpdateManyInput>
    /**
     * Filter which TipoMovimientos to update
     */
    where?: TipoMovimientoWhereInput
    /**
     * Limit how many TipoMovimientos to update.
     */
    limit?: number
  }

  /**
   * TipoMovimiento upsert
   */
  export type TipoMovimientoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TipoMovimiento
     */
    select?: TipoMovimientoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TipoMovimiento
     */
    omit?: TipoMovimientoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TipoMovimientoInclude<ExtArgs> | null
    /**
     * The filter to search for the TipoMovimiento to update in case it exists.
     */
    where: TipoMovimientoWhereUniqueInput
    /**
     * In case the TipoMovimiento found by the `where` argument doesn't exist, create a new TipoMovimiento with this data.
     */
    create: XOR<TipoMovimientoCreateInput, TipoMovimientoUncheckedCreateInput>
    /**
     * In case the TipoMovimiento was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TipoMovimientoUpdateInput, TipoMovimientoUncheckedUpdateInput>
  }

  /**
   * TipoMovimiento delete
   */
  export type TipoMovimientoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TipoMovimiento
     */
    select?: TipoMovimientoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TipoMovimiento
     */
    omit?: TipoMovimientoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TipoMovimientoInclude<ExtArgs> | null
    /**
     * Filter which TipoMovimiento to delete.
     */
    where: TipoMovimientoWhereUniqueInput
  }

  /**
   * TipoMovimiento deleteMany
   */
  export type TipoMovimientoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TipoMovimientos to delete
     */
    where?: TipoMovimientoWhereInput
    /**
     * Limit how many TipoMovimientos to delete.
     */
    limit?: number
  }

  /**
   * TipoMovimiento.movimientos
   */
  export type TipoMovimiento$movimientosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MovimientoStock
     */
    select?: MovimientoStockSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MovimientoStock
     */
    omit?: MovimientoStockOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MovimientoStockInclude<ExtArgs> | null
    where?: MovimientoStockWhereInput
    orderBy?: MovimientoStockOrderByWithRelationInput | MovimientoStockOrderByWithRelationInput[]
    cursor?: MovimientoStockWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MovimientoStockScalarFieldEnum | MovimientoStockScalarFieldEnum[]
  }

  /**
   * TipoMovimiento without action
   */
  export type TipoMovimientoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TipoMovimiento
     */
    select?: TipoMovimientoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TipoMovimiento
     */
    omit?: TipoMovimientoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TipoMovimientoInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const RubroScalarFieldEnum: {
    id: 'id',
    nombre: 'nombre'
  };

  export type RubroScalarFieldEnum = (typeof RubroScalarFieldEnum)[keyof typeof RubroScalarFieldEnum]


  export const UnidadScalarFieldEnum: {
    id: 'id',
    nombre: 'nombre'
  };

  export type UnidadScalarFieldEnum = (typeof UnidadScalarFieldEnum)[keyof typeof UnidadScalarFieldEnum]


  export const MarcaScalarFieldEnum: {
    id: 'id',
    nombre: 'nombre'
  };

  export type MarcaScalarFieldEnum = (typeof MarcaScalarFieldEnum)[keyof typeof MarcaScalarFieldEnum]


  export const ProductoScalarFieldEnum: {
    id: 'id',
    nombre: 'nombre',
    descripcion: 'descripcion',
    rubroId: 'rubroId',
    marcaId: 'marcaId',
    unidadId: 'unidadId',
    precioCompra: 'precioCompra',
    precioVenta: 'precioVenta',
    estado: 'estado'
  };

  export type ProductoScalarFieldEnum = (typeof ProductoScalarFieldEnum)[keyof typeof ProductoScalarFieldEnum]


  export const DepositoScalarFieldEnum: {
    id: 'id',
    nombre: 'nombre',
    ubicacion: 'ubicacion',
    tipo: 'tipo',
    capacidad: 'capacidad',
    estado: 'estado'
  };

  export type DepositoScalarFieldEnum = (typeof DepositoScalarFieldEnum)[keyof typeof DepositoScalarFieldEnum]


  export const StockPorDepositoScalarFieldEnum: {
    id: 'id',
    productoId: 'productoId',
    depositoId: 'depositoId',
    stockActual: 'stockActual',
    stockMinimo: 'stockMinimo',
    stockMaximo: 'stockMaximo',
    capacidadMaxima: 'capacidadMaxima'
  };

  export type StockPorDepositoScalarFieldEnum = (typeof StockPorDepositoScalarFieldEnum)[keyof typeof StockPorDepositoScalarFieldEnum]


  export const MovimientoStockScalarFieldEnum: {
    id: 'id',
    depositoId: 'depositoId',
    tipoMovimientoId: 'tipoMovimientoId',
    tipoComprobanteId: 'tipoComprobanteId',
    fecha: 'fecha',
    hora: 'hora'
  };

  export type MovimientoStockScalarFieldEnum = (typeof MovimientoStockScalarFieldEnum)[keyof typeof MovimientoStockScalarFieldEnum]


  export const DetalleMovimientoScalarFieldEnum: {
    id: 'id',
    movimientoId: 'movimientoId',
    stockId: 'stockId',
    cantidad: 'cantidad'
  };

  export type DetalleMovimientoScalarFieldEnum = (typeof DetalleMovimientoScalarFieldEnum)[keyof typeof DetalleMovimientoScalarFieldEnum]


  export const TipoComprobanteScalarFieldEnum: {
    id: 'id',
    nombre: 'nombre'
  };

  export type TipoComprobanteScalarFieldEnum = (typeof TipoComprobanteScalarFieldEnum)[keyof typeof TipoComprobanteScalarFieldEnum]


  export const TipoMovimientoScalarFieldEnum: {
    id: 'id',
    nombre: 'nombre',
    ingresoEgreso: 'ingresoEgreso'
  };

  export type TipoMovimientoScalarFieldEnum = (typeof TipoMovimientoScalarFieldEnum)[keyof typeof TipoMovimientoScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    
  /**
   * Deep Input Types
   */


  export type RubroWhereInput = {
    AND?: RubroWhereInput | RubroWhereInput[]
    OR?: RubroWhereInput[]
    NOT?: RubroWhereInput | RubroWhereInput[]
    id?: IntFilter<"Rubro"> | number
    nombre?: StringFilter<"Rubro"> | string
    productos?: ProductoListRelationFilter
  }

  export type RubroOrderByWithRelationInput = {
    id?: SortOrder
    nombre?: SortOrder
    productos?: ProductoOrderByRelationAggregateInput
  }

  export type RubroWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: RubroWhereInput | RubroWhereInput[]
    OR?: RubroWhereInput[]
    NOT?: RubroWhereInput | RubroWhereInput[]
    nombre?: StringFilter<"Rubro"> | string
    productos?: ProductoListRelationFilter
  }, "id">

  export type RubroOrderByWithAggregationInput = {
    id?: SortOrder
    nombre?: SortOrder
    _count?: RubroCountOrderByAggregateInput
    _avg?: RubroAvgOrderByAggregateInput
    _max?: RubroMaxOrderByAggregateInput
    _min?: RubroMinOrderByAggregateInput
    _sum?: RubroSumOrderByAggregateInput
  }

  export type RubroScalarWhereWithAggregatesInput = {
    AND?: RubroScalarWhereWithAggregatesInput | RubroScalarWhereWithAggregatesInput[]
    OR?: RubroScalarWhereWithAggregatesInput[]
    NOT?: RubroScalarWhereWithAggregatesInput | RubroScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Rubro"> | number
    nombre?: StringWithAggregatesFilter<"Rubro"> | string
  }

  export type UnidadWhereInput = {
    AND?: UnidadWhereInput | UnidadWhereInput[]
    OR?: UnidadWhereInput[]
    NOT?: UnidadWhereInput | UnidadWhereInput[]
    id?: IntFilter<"Unidad"> | number
    nombre?: StringFilter<"Unidad"> | string
    productos?: ProductoListRelationFilter
  }

  export type UnidadOrderByWithRelationInput = {
    id?: SortOrder
    nombre?: SortOrder
    productos?: ProductoOrderByRelationAggregateInput
  }

  export type UnidadWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: UnidadWhereInput | UnidadWhereInput[]
    OR?: UnidadWhereInput[]
    NOT?: UnidadWhereInput | UnidadWhereInput[]
    nombre?: StringFilter<"Unidad"> | string
    productos?: ProductoListRelationFilter
  }, "id">

  export type UnidadOrderByWithAggregationInput = {
    id?: SortOrder
    nombre?: SortOrder
    _count?: UnidadCountOrderByAggregateInput
    _avg?: UnidadAvgOrderByAggregateInput
    _max?: UnidadMaxOrderByAggregateInput
    _min?: UnidadMinOrderByAggregateInput
    _sum?: UnidadSumOrderByAggregateInput
  }

  export type UnidadScalarWhereWithAggregatesInput = {
    AND?: UnidadScalarWhereWithAggregatesInput | UnidadScalarWhereWithAggregatesInput[]
    OR?: UnidadScalarWhereWithAggregatesInput[]
    NOT?: UnidadScalarWhereWithAggregatesInput | UnidadScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Unidad"> | number
    nombre?: StringWithAggregatesFilter<"Unidad"> | string
  }

  export type MarcaWhereInput = {
    AND?: MarcaWhereInput | MarcaWhereInput[]
    OR?: MarcaWhereInput[]
    NOT?: MarcaWhereInput | MarcaWhereInput[]
    id?: IntFilter<"Marca"> | number
    nombre?: StringFilter<"Marca"> | string
    productos?: ProductoListRelationFilter
  }

  export type MarcaOrderByWithRelationInput = {
    id?: SortOrder
    nombre?: SortOrder
    productos?: ProductoOrderByRelationAggregateInput
  }

  export type MarcaWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: MarcaWhereInput | MarcaWhereInput[]
    OR?: MarcaWhereInput[]
    NOT?: MarcaWhereInput | MarcaWhereInput[]
    nombre?: StringFilter<"Marca"> | string
    productos?: ProductoListRelationFilter
  }, "id">

  export type MarcaOrderByWithAggregationInput = {
    id?: SortOrder
    nombre?: SortOrder
    _count?: MarcaCountOrderByAggregateInput
    _avg?: MarcaAvgOrderByAggregateInput
    _max?: MarcaMaxOrderByAggregateInput
    _min?: MarcaMinOrderByAggregateInput
    _sum?: MarcaSumOrderByAggregateInput
  }

  export type MarcaScalarWhereWithAggregatesInput = {
    AND?: MarcaScalarWhereWithAggregatesInput | MarcaScalarWhereWithAggregatesInput[]
    OR?: MarcaScalarWhereWithAggregatesInput[]
    NOT?: MarcaScalarWhereWithAggregatesInput | MarcaScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Marca"> | number
    nombre?: StringWithAggregatesFilter<"Marca"> | string
  }

  export type ProductoWhereInput = {
    AND?: ProductoWhereInput | ProductoWhereInput[]
    OR?: ProductoWhereInput[]
    NOT?: ProductoWhereInput | ProductoWhereInput[]
    id?: IntFilter<"Producto"> | number
    nombre?: StringFilter<"Producto"> | string
    descripcion?: StringNullableFilter<"Producto"> | string | null
    rubroId?: IntFilter<"Producto"> | number
    marcaId?: IntFilter<"Producto"> | number
    unidadId?: IntFilter<"Producto"> | number
    precioCompra?: FloatFilter<"Producto"> | number
    precioVenta?: FloatFilter<"Producto"> | number
    estado?: BoolFilter<"Producto"> | boolean
    marca?: XOR<MarcaScalarRelationFilter, MarcaWhereInput>
    rubro?: XOR<RubroScalarRelationFilter, RubroWhereInput>
    unidad?: XOR<UnidadScalarRelationFilter, UnidadWhereInput>
    stockProductos?: StockPorDepositoListRelationFilter
  }

  export type ProductoOrderByWithRelationInput = {
    id?: SortOrder
    nombre?: SortOrder
    descripcion?: SortOrderInput | SortOrder
    rubroId?: SortOrder
    marcaId?: SortOrder
    unidadId?: SortOrder
    precioCompra?: SortOrder
    precioVenta?: SortOrder
    estado?: SortOrder
    marca?: MarcaOrderByWithRelationInput
    rubro?: RubroOrderByWithRelationInput
    unidad?: UnidadOrderByWithRelationInput
    stockProductos?: StockPorDepositoOrderByRelationAggregateInput
  }

  export type ProductoWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: ProductoWhereInput | ProductoWhereInput[]
    OR?: ProductoWhereInput[]
    NOT?: ProductoWhereInput | ProductoWhereInput[]
    nombre?: StringFilter<"Producto"> | string
    descripcion?: StringNullableFilter<"Producto"> | string | null
    rubroId?: IntFilter<"Producto"> | number
    marcaId?: IntFilter<"Producto"> | number
    unidadId?: IntFilter<"Producto"> | number
    precioCompra?: FloatFilter<"Producto"> | number
    precioVenta?: FloatFilter<"Producto"> | number
    estado?: BoolFilter<"Producto"> | boolean
    marca?: XOR<MarcaScalarRelationFilter, MarcaWhereInput>
    rubro?: XOR<RubroScalarRelationFilter, RubroWhereInput>
    unidad?: XOR<UnidadScalarRelationFilter, UnidadWhereInput>
    stockProductos?: StockPorDepositoListRelationFilter
  }, "id">

  export type ProductoOrderByWithAggregationInput = {
    id?: SortOrder
    nombre?: SortOrder
    descripcion?: SortOrderInput | SortOrder
    rubroId?: SortOrder
    marcaId?: SortOrder
    unidadId?: SortOrder
    precioCompra?: SortOrder
    precioVenta?: SortOrder
    estado?: SortOrder
    _count?: ProductoCountOrderByAggregateInput
    _avg?: ProductoAvgOrderByAggregateInput
    _max?: ProductoMaxOrderByAggregateInput
    _min?: ProductoMinOrderByAggregateInput
    _sum?: ProductoSumOrderByAggregateInput
  }

  export type ProductoScalarWhereWithAggregatesInput = {
    AND?: ProductoScalarWhereWithAggregatesInput | ProductoScalarWhereWithAggregatesInput[]
    OR?: ProductoScalarWhereWithAggregatesInput[]
    NOT?: ProductoScalarWhereWithAggregatesInput | ProductoScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Producto"> | number
    nombre?: StringWithAggregatesFilter<"Producto"> | string
    descripcion?: StringNullableWithAggregatesFilter<"Producto"> | string | null
    rubroId?: IntWithAggregatesFilter<"Producto"> | number
    marcaId?: IntWithAggregatesFilter<"Producto"> | number
    unidadId?: IntWithAggregatesFilter<"Producto"> | number
    precioCompra?: FloatWithAggregatesFilter<"Producto"> | number
    precioVenta?: FloatWithAggregatesFilter<"Producto"> | number
    estado?: BoolWithAggregatesFilter<"Producto"> | boolean
  }

  export type DepositoWhereInput = {
    AND?: DepositoWhereInput | DepositoWhereInput[]
    OR?: DepositoWhereInput[]
    NOT?: DepositoWhereInput | DepositoWhereInput[]
    id?: IntFilter<"Deposito"> | number
    nombre?: StringFilter<"Deposito"> | string
    ubicacion?: StringFilter<"Deposito"> | string
    tipo?: StringFilter<"Deposito"> | string
    capacidad?: IntNullableFilter<"Deposito"> | number | null
    estado?: BoolFilter<"Deposito"> | boolean
    movimientos?: MovimientoStockListRelationFilter
    stock?: StockPorDepositoListRelationFilter
  }

  export type DepositoOrderByWithRelationInput = {
    id?: SortOrder
    nombre?: SortOrder
    ubicacion?: SortOrder
    tipo?: SortOrder
    capacidad?: SortOrderInput | SortOrder
    estado?: SortOrder
    movimientos?: MovimientoStockOrderByRelationAggregateInput
    stock?: StockPorDepositoOrderByRelationAggregateInput
  }

  export type DepositoWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: DepositoWhereInput | DepositoWhereInput[]
    OR?: DepositoWhereInput[]
    NOT?: DepositoWhereInput | DepositoWhereInput[]
    nombre?: StringFilter<"Deposito"> | string
    ubicacion?: StringFilter<"Deposito"> | string
    tipo?: StringFilter<"Deposito"> | string
    capacidad?: IntNullableFilter<"Deposito"> | number | null
    estado?: BoolFilter<"Deposito"> | boolean
    movimientos?: MovimientoStockListRelationFilter
    stock?: StockPorDepositoListRelationFilter
  }, "id">

  export type DepositoOrderByWithAggregationInput = {
    id?: SortOrder
    nombre?: SortOrder
    ubicacion?: SortOrder
    tipo?: SortOrder
    capacidad?: SortOrderInput | SortOrder
    estado?: SortOrder
    _count?: DepositoCountOrderByAggregateInput
    _avg?: DepositoAvgOrderByAggregateInput
    _max?: DepositoMaxOrderByAggregateInput
    _min?: DepositoMinOrderByAggregateInput
    _sum?: DepositoSumOrderByAggregateInput
  }

  export type DepositoScalarWhereWithAggregatesInput = {
    AND?: DepositoScalarWhereWithAggregatesInput | DepositoScalarWhereWithAggregatesInput[]
    OR?: DepositoScalarWhereWithAggregatesInput[]
    NOT?: DepositoScalarWhereWithAggregatesInput | DepositoScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Deposito"> | number
    nombre?: StringWithAggregatesFilter<"Deposito"> | string
    ubicacion?: StringWithAggregatesFilter<"Deposito"> | string
    tipo?: StringWithAggregatesFilter<"Deposito"> | string
    capacidad?: IntNullableWithAggregatesFilter<"Deposito"> | number | null
    estado?: BoolWithAggregatesFilter<"Deposito"> | boolean
  }

  export type StockPorDepositoWhereInput = {
    AND?: StockPorDepositoWhereInput | StockPorDepositoWhereInput[]
    OR?: StockPorDepositoWhereInput[]
    NOT?: StockPorDepositoWhereInput | StockPorDepositoWhereInput[]
    id?: IntFilter<"StockPorDeposito"> | number
    productoId?: IntFilter<"StockPorDeposito"> | number
    depositoId?: IntFilter<"StockPorDeposito"> | number
    stockActual?: IntFilter<"StockPorDeposito"> | number
    stockMinimo?: IntFilter<"StockPorDeposito"> | number
    stockMaximo?: IntNullableFilter<"StockPorDeposito"> | number | null
    capacidadMaxima?: IntNullableFilter<"StockPorDeposito"> | number | null
    detallesMovimiento?: DetalleMovimientoListRelationFilter
    deposito?: XOR<DepositoScalarRelationFilter, DepositoWhereInput>
    producto?: XOR<ProductoScalarRelationFilter, ProductoWhereInput>
  }

  export type StockPorDepositoOrderByWithRelationInput = {
    id?: SortOrder
    productoId?: SortOrder
    depositoId?: SortOrder
    stockActual?: SortOrder
    stockMinimo?: SortOrder
    stockMaximo?: SortOrderInput | SortOrder
    capacidadMaxima?: SortOrderInput | SortOrder
    detallesMovimiento?: DetalleMovimientoOrderByRelationAggregateInput
    deposito?: DepositoOrderByWithRelationInput
    producto?: ProductoOrderByWithRelationInput
  }

  export type StockPorDepositoWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    productoId_depositoId?: StockPorDepositoProductoIdDepositoIdCompoundUniqueInput
    AND?: StockPorDepositoWhereInput | StockPorDepositoWhereInput[]
    OR?: StockPorDepositoWhereInput[]
    NOT?: StockPorDepositoWhereInput | StockPorDepositoWhereInput[]
    productoId?: IntFilter<"StockPorDeposito"> | number
    depositoId?: IntFilter<"StockPorDeposito"> | number
    stockActual?: IntFilter<"StockPorDeposito"> | number
    stockMinimo?: IntFilter<"StockPorDeposito"> | number
    stockMaximo?: IntNullableFilter<"StockPorDeposito"> | number | null
    capacidadMaxima?: IntNullableFilter<"StockPorDeposito"> | number | null
    detallesMovimiento?: DetalleMovimientoListRelationFilter
    deposito?: XOR<DepositoScalarRelationFilter, DepositoWhereInput>
    producto?: XOR<ProductoScalarRelationFilter, ProductoWhereInput>
  }, "id" | "productoId_depositoId">

  export type StockPorDepositoOrderByWithAggregationInput = {
    id?: SortOrder
    productoId?: SortOrder
    depositoId?: SortOrder
    stockActual?: SortOrder
    stockMinimo?: SortOrder
    stockMaximo?: SortOrderInput | SortOrder
    capacidadMaxima?: SortOrderInput | SortOrder
    _count?: StockPorDepositoCountOrderByAggregateInput
    _avg?: StockPorDepositoAvgOrderByAggregateInput
    _max?: StockPorDepositoMaxOrderByAggregateInput
    _min?: StockPorDepositoMinOrderByAggregateInput
    _sum?: StockPorDepositoSumOrderByAggregateInput
  }

  export type StockPorDepositoScalarWhereWithAggregatesInput = {
    AND?: StockPorDepositoScalarWhereWithAggregatesInput | StockPorDepositoScalarWhereWithAggregatesInput[]
    OR?: StockPorDepositoScalarWhereWithAggregatesInput[]
    NOT?: StockPorDepositoScalarWhereWithAggregatesInput | StockPorDepositoScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"StockPorDeposito"> | number
    productoId?: IntWithAggregatesFilter<"StockPorDeposito"> | number
    depositoId?: IntWithAggregatesFilter<"StockPorDeposito"> | number
    stockActual?: IntWithAggregatesFilter<"StockPorDeposito"> | number
    stockMinimo?: IntWithAggregatesFilter<"StockPorDeposito"> | number
    stockMaximo?: IntNullableWithAggregatesFilter<"StockPorDeposito"> | number | null
    capacidadMaxima?: IntNullableWithAggregatesFilter<"StockPorDeposito"> | number | null
  }

  export type MovimientoStockWhereInput = {
    AND?: MovimientoStockWhereInput | MovimientoStockWhereInput[]
    OR?: MovimientoStockWhereInput[]
    NOT?: MovimientoStockWhereInput | MovimientoStockWhereInput[]
    id?: IntFilter<"MovimientoStock"> | number
    depositoId?: IntFilter<"MovimientoStock"> | number
    tipoMovimientoId?: IntFilter<"MovimientoStock"> | number
    tipoComprobanteId?: IntFilter<"MovimientoStock"> | number
    fecha?: DateTimeFilter<"MovimientoStock"> | Date | string
    hora?: DateTimeFilter<"MovimientoStock"> | Date | string
    detalles?: DetalleMovimientoListRelationFilter
    deposito?: XOR<DepositoScalarRelationFilter, DepositoWhereInput>
    tipoComprobante?: XOR<TipoComprobanteScalarRelationFilter, TipoComprobanteWhereInput>
    tipoMovimiento?: XOR<TipoMovimientoScalarRelationFilter, TipoMovimientoWhereInput>
  }

  export type MovimientoStockOrderByWithRelationInput = {
    id?: SortOrder
    depositoId?: SortOrder
    tipoMovimientoId?: SortOrder
    tipoComprobanteId?: SortOrder
    fecha?: SortOrder
    hora?: SortOrder
    detalles?: DetalleMovimientoOrderByRelationAggregateInput
    deposito?: DepositoOrderByWithRelationInput
    tipoComprobante?: TipoComprobanteOrderByWithRelationInput
    tipoMovimiento?: TipoMovimientoOrderByWithRelationInput
  }

  export type MovimientoStockWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: MovimientoStockWhereInput | MovimientoStockWhereInput[]
    OR?: MovimientoStockWhereInput[]
    NOT?: MovimientoStockWhereInput | MovimientoStockWhereInput[]
    depositoId?: IntFilter<"MovimientoStock"> | number
    tipoMovimientoId?: IntFilter<"MovimientoStock"> | number
    tipoComprobanteId?: IntFilter<"MovimientoStock"> | number
    fecha?: DateTimeFilter<"MovimientoStock"> | Date | string
    hora?: DateTimeFilter<"MovimientoStock"> | Date | string
    detalles?: DetalleMovimientoListRelationFilter
    deposito?: XOR<DepositoScalarRelationFilter, DepositoWhereInput>
    tipoComprobante?: XOR<TipoComprobanteScalarRelationFilter, TipoComprobanteWhereInput>
    tipoMovimiento?: XOR<TipoMovimientoScalarRelationFilter, TipoMovimientoWhereInput>
  }, "id">

  export type MovimientoStockOrderByWithAggregationInput = {
    id?: SortOrder
    depositoId?: SortOrder
    tipoMovimientoId?: SortOrder
    tipoComprobanteId?: SortOrder
    fecha?: SortOrder
    hora?: SortOrder
    _count?: MovimientoStockCountOrderByAggregateInput
    _avg?: MovimientoStockAvgOrderByAggregateInput
    _max?: MovimientoStockMaxOrderByAggregateInput
    _min?: MovimientoStockMinOrderByAggregateInput
    _sum?: MovimientoStockSumOrderByAggregateInput
  }

  export type MovimientoStockScalarWhereWithAggregatesInput = {
    AND?: MovimientoStockScalarWhereWithAggregatesInput | MovimientoStockScalarWhereWithAggregatesInput[]
    OR?: MovimientoStockScalarWhereWithAggregatesInput[]
    NOT?: MovimientoStockScalarWhereWithAggregatesInput | MovimientoStockScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"MovimientoStock"> | number
    depositoId?: IntWithAggregatesFilter<"MovimientoStock"> | number
    tipoMovimientoId?: IntWithAggregatesFilter<"MovimientoStock"> | number
    tipoComprobanteId?: IntWithAggregatesFilter<"MovimientoStock"> | number
    fecha?: DateTimeWithAggregatesFilter<"MovimientoStock"> | Date | string
    hora?: DateTimeWithAggregatesFilter<"MovimientoStock"> | Date | string
  }

  export type DetalleMovimientoWhereInput = {
    AND?: DetalleMovimientoWhereInput | DetalleMovimientoWhereInput[]
    OR?: DetalleMovimientoWhereInput[]
    NOT?: DetalleMovimientoWhereInput | DetalleMovimientoWhereInput[]
    id?: IntFilter<"DetalleMovimiento"> | number
    movimientoId?: IntFilter<"DetalleMovimiento"> | number
    stockId?: IntFilter<"DetalleMovimiento"> | number
    cantidad?: IntFilter<"DetalleMovimiento"> | number
    movimiento?: XOR<MovimientoStockScalarRelationFilter, MovimientoStockWhereInput>
    stock?: XOR<StockPorDepositoScalarRelationFilter, StockPorDepositoWhereInput>
  }

  export type DetalleMovimientoOrderByWithRelationInput = {
    id?: SortOrder
    movimientoId?: SortOrder
    stockId?: SortOrder
    cantidad?: SortOrder
    movimiento?: MovimientoStockOrderByWithRelationInput
    stock?: StockPorDepositoOrderByWithRelationInput
  }

  export type DetalleMovimientoWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: DetalleMovimientoWhereInput | DetalleMovimientoWhereInput[]
    OR?: DetalleMovimientoWhereInput[]
    NOT?: DetalleMovimientoWhereInput | DetalleMovimientoWhereInput[]
    movimientoId?: IntFilter<"DetalleMovimiento"> | number
    stockId?: IntFilter<"DetalleMovimiento"> | number
    cantidad?: IntFilter<"DetalleMovimiento"> | number
    movimiento?: XOR<MovimientoStockScalarRelationFilter, MovimientoStockWhereInput>
    stock?: XOR<StockPorDepositoScalarRelationFilter, StockPorDepositoWhereInput>
  }, "id">

  export type DetalleMovimientoOrderByWithAggregationInput = {
    id?: SortOrder
    movimientoId?: SortOrder
    stockId?: SortOrder
    cantidad?: SortOrder
    _count?: DetalleMovimientoCountOrderByAggregateInput
    _avg?: DetalleMovimientoAvgOrderByAggregateInput
    _max?: DetalleMovimientoMaxOrderByAggregateInput
    _min?: DetalleMovimientoMinOrderByAggregateInput
    _sum?: DetalleMovimientoSumOrderByAggregateInput
  }

  export type DetalleMovimientoScalarWhereWithAggregatesInput = {
    AND?: DetalleMovimientoScalarWhereWithAggregatesInput | DetalleMovimientoScalarWhereWithAggregatesInput[]
    OR?: DetalleMovimientoScalarWhereWithAggregatesInput[]
    NOT?: DetalleMovimientoScalarWhereWithAggregatesInput | DetalleMovimientoScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"DetalleMovimiento"> | number
    movimientoId?: IntWithAggregatesFilter<"DetalleMovimiento"> | number
    stockId?: IntWithAggregatesFilter<"DetalleMovimiento"> | number
    cantidad?: IntWithAggregatesFilter<"DetalleMovimiento"> | number
  }

  export type TipoComprobanteWhereInput = {
    AND?: TipoComprobanteWhereInput | TipoComprobanteWhereInput[]
    OR?: TipoComprobanteWhereInput[]
    NOT?: TipoComprobanteWhereInput | TipoComprobanteWhereInput[]
    id?: IntFilter<"TipoComprobante"> | number
    nombre?: StringFilter<"TipoComprobante"> | string
    movimientos?: MovimientoStockListRelationFilter
  }

  export type TipoComprobanteOrderByWithRelationInput = {
    id?: SortOrder
    nombre?: SortOrder
    movimientos?: MovimientoStockOrderByRelationAggregateInput
  }

  export type TipoComprobanteWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: TipoComprobanteWhereInput | TipoComprobanteWhereInput[]
    OR?: TipoComprobanteWhereInput[]
    NOT?: TipoComprobanteWhereInput | TipoComprobanteWhereInput[]
    nombre?: StringFilter<"TipoComprobante"> | string
    movimientos?: MovimientoStockListRelationFilter
  }, "id">

  export type TipoComprobanteOrderByWithAggregationInput = {
    id?: SortOrder
    nombre?: SortOrder
    _count?: TipoComprobanteCountOrderByAggregateInput
    _avg?: TipoComprobanteAvgOrderByAggregateInput
    _max?: TipoComprobanteMaxOrderByAggregateInput
    _min?: TipoComprobanteMinOrderByAggregateInput
    _sum?: TipoComprobanteSumOrderByAggregateInput
  }

  export type TipoComprobanteScalarWhereWithAggregatesInput = {
    AND?: TipoComprobanteScalarWhereWithAggregatesInput | TipoComprobanteScalarWhereWithAggregatesInput[]
    OR?: TipoComprobanteScalarWhereWithAggregatesInput[]
    NOT?: TipoComprobanteScalarWhereWithAggregatesInput | TipoComprobanteScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"TipoComprobante"> | number
    nombre?: StringWithAggregatesFilter<"TipoComprobante"> | string
  }

  export type TipoMovimientoWhereInput = {
    AND?: TipoMovimientoWhereInput | TipoMovimientoWhereInput[]
    OR?: TipoMovimientoWhereInput[]
    NOT?: TipoMovimientoWhereInput | TipoMovimientoWhereInput[]
    id?: IntFilter<"TipoMovimiento"> | number
    nombre?: StringFilter<"TipoMovimiento"> | string
    ingresoEgreso?: BoolFilter<"TipoMovimiento"> | boolean
    movimientos?: MovimientoStockListRelationFilter
  }

  export type TipoMovimientoOrderByWithRelationInput = {
    id?: SortOrder
    nombre?: SortOrder
    ingresoEgreso?: SortOrder
    movimientos?: MovimientoStockOrderByRelationAggregateInput
  }

  export type TipoMovimientoWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: TipoMovimientoWhereInput | TipoMovimientoWhereInput[]
    OR?: TipoMovimientoWhereInput[]
    NOT?: TipoMovimientoWhereInput | TipoMovimientoWhereInput[]
    nombre?: StringFilter<"TipoMovimiento"> | string
    ingresoEgreso?: BoolFilter<"TipoMovimiento"> | boolean
    movimientos?: MovimientoStockListRelationFilter
  }, "id">

  export type TipoMovimientoOrderByWithAggregationInput = {
    id?: SortOrder
    nombre?: SortOrder
    ingresoEgreso?: SortOrder
    _count?: TipoMovimientoCountOrderByAggregateInput
    _avg?: TipoMovimientoAvgOrderByAggregateInput
    _max?: TipoMovimientoMaxOrderByAggregateInput
    _min?: TipoMovimientoMinOrderByAggregateInput
    _sum?: TipoMovimientoSumOrderByAggregateInput
  }

  export type TipoMovimientoScalarWhereWithAggregatesInput = {
    AND?: TipoMovimientoScalarWhereWithAggregatesInput | TipoMovimientoScalarWhereWithAggregatesInput[]
    OR?: TipoMovimientoScalarWhereWithAggregatesInput[]
    NOT?: TipoMovimientoScalarWhereWithAggregatesInput | TipoMovimientoScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"TipoMovimiento"> | number
    nombre?: StringWithAggregatesFilter<"TipoMovimiento"> | string
    ingresoEgreso?: BoolWithAggregatesFilter<"TipoMovimiento"> | boolean
  }

  export type RubroCreateInput = {
    nombre: string
    productos?: ProductoCreateNestedManyWithoutRubroInput
  }

  export type RubroUncheckedCreateInput = {
    id?: number
    nombre: string
    productos?: ProductoUncheckedCreateNestedManyWithoutRubroInput
  }

  export type RubroUpdateInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    productos?: ProductoUpdateManyWithoutRubroNestedInput
  }

  export type RubroUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    productos?: ProductoUncheckedUpdateManyWithoutRubroNestedInput
  }

  export type RubroCreateManyInput = {
    id?: number
    nombre: string
  }

  export type RubroUpdateManyMutationInput = {
    nombre?: StringFieldUpdateOperationsInput | string
  }

  export type RubroUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
  }

  export type UnidadCreateInput = {
    nombre: string
    productos?: ProductoCreateNestedManyWithoutUnidadInput
  }

  export type UnidadUncheckedCreateInput = {
    id?: number
    nombre: string
    productos?: ProductoUncheckedCreateNestedManyWithoutUnidadInput
  }

  export type UnidadUpdateInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    productos?: ProductoUpdateManyWithoutUnidadNestedInput
  }

  export type UnidadUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    productos?: ProductoUncheckedUpdateManyWithoutUnidadNestedInput
  }

  export type UnidadCreateManyInput = {
    id?: number
    nombre: string
  }

  export type UnidadUpdateManyMutationInput = {
    nombre?: StringFieldUpdateOperationsInput | string
  }

  export type UnidadUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
  }

  export type MarcaCreateInput = {
    nombre: string
    productos?: ProductoCreateNestedManyWithoutMarcaInput
  }

  export type MarcaUncheckedCreateInput = {
    id?: number
    nombre: string
    productos?: ProductoUncheckedCreateNestedManyWithoutMarcaInput
  }

  export type MarcaUpdateInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    productos?: ProductoUpdateManyWithoutMarcaNestedInput
  }

  export type MarcaUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    productos?: ProductoUncheckedUpdateManyWithoutMarcaNestedInput
  }

  export type MarcaCreateManyInput = {
    id?: number
    nombre: string
  }

  export type MarcaUpdateManyMutationInput = {
    nombre?: StringFieldUpdateOperationsInput | string
  }

  export type MarcaUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
  }

  export type ProductoCreateInput = {
    nombre: string
    descripcion?: string | null
    precioCompra: number
    precioVenta: number
    estado?: boolean
    marca: MarcaCreateNestedOneWithoutProductosInput
    rubro: RubroCreateNestedOneWithoutProductosInput
    unidad: UnidadCreateNestedOneWithoutProductosInput
    stockProductos?: StockPorDepositoCreateNestedManyWithoutProductoInput
  }

  export type ProductoUncheckedCreateInput = {
    id?: number
    nombre: string
    descripcion?: string | null
    rubroId: number
    marcaId: number
    unidadId: number
    precioCompra: number
    precioVenta: number
    estado?: boolean
    stockProductos?: StockPorDepositoUncheckedCreateNestedManyWithoutProductoInput
  }

  export type ProductoUpdateInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null
    precioCompra?: FloatFieldUpdateOperationsInput | number
    precioVenta?: FloatFieldUpdateOperationsInput | number
    estado?: BoolFieldUpdateOperationsInput | boolean
    marca?: MarcaUpdateOneRequiredWithoutProductosNestedInput
    rubro?: RubroUpdateOneRequiredWithoutProductosNestedInput
    unidad?: UnidadUpdateOneRequiredWithoutProductosNestedInput
    stockProductos?: StockPorDepositoUpdateManyWithoutProductoNestedInput
  }

  export type ProductoUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null
    rubroId?: IntFieldUpdateOperationsInput | number
    marcaId?: IntFieldUpdateOperationsInput | number
    unidadId?: IntFieldUpdateOperationsInput | number
    precioCompra?: FloatFieldUpdateOperationsInput | number
    precioVenta?: FloatFieldUpdateOperationsInput | number
    estado?: BoolFieldUpdateOperationsInput | boolean
    stockProductos?: StockPorDepositoUncheckedUpdateManyWithoutProductoNestedInput
  }

  export type ProductoCreateManyInput = {
    id?: number
    nombre: string
    descripcion?: string | null
    rubroId: number
    marcaId: number
    unidadId: number
    precioCompra: number
    precioVenta: number
    estado?: boolean
  }

  export type ProductoUpdateManyMutationInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null
    precioCompra?: FloatFieldUpdateOperationsInput | number
    precioVenta?: FloatFieldUpdateOperationsInput | number
    estado?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ProductoUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null
    rubroId?: IntFieldUpdateOperationsInput | number
    marcaId?: IntFieldUpdateOperationsInput | number
    unidadId?: IntFieldUpdateOperationsInput | number
    precioCompra?: FloatFieldUpdateOperationsInput | number
    precioVenta?: FloatFieldUpdateOperationsInput | number
    estado?: BoolFieldUpdateOperationsInput | boolean
  }

  export type DepositoCreateInput = {
    nombre: string
    ubicacion: string
    tipo: string
    capacidad?: number | null
    estado?: boolean
    movimientos?: MovimientoStockCreateNestedManyWithoutDepositoInput
    stock?: StockPorDepositoCreateNestedManyWithoutDepositoInput
  }

  export type DepositoUncheckedCreateInput = {
    id?: number
    nombre: string
    ubicacion: string
    tipo: string
    capacidad?: number | null
    estado?: boolean
    movimientos?: MovimientoStockUncheckedCreateNestedManyWithoutDepositoInput
    stock?: StockPorDepositoUncheckedCreateNestedManyWithoutDepositoInput
  }

  export type DepositoUpdateInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    ubicacion?: StringFieldUpdateOperationsInput | string
    tipo?: StringFieldUpdateOperationsInput | string
    capacidad?: NullableIntFieldUpdateOperationsInput | number | null
    estado?: BoolFieldUpdateOperationsInput | boolean
    movimientos?: MovimientoStockUpdateManyWithoutDepositoNestedInput
    stock?: StockPorDepositoUpdateManyWithoutDepositoNestedInput
  }

  export type DepositoUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    ubicacion?: StringFieldUpdateOperationsInput | string
    tipo?: StringFieldUpdateOperationsInput | string
    capacidad?: NullableIntFieldUpdateOperationsInput | number | null
    estado?: BoolFieldUpdateOperationsInput | boolean
    movimientos?: MovimientoStockUncheckedUpdateManyWithoutDepositoNestedInput
    stock?: StockPorDepositoUncheckedUpdateManyWithoutDepositoNestedInput
  }

  export type DepositoCreateManyInput = {
    id?: number
    nombre: string
    ubicacion: string
    tipo: string
    capacidad?: number | null
    estado?: boolean
  }

  export type DepositoUpdateManyMutationInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    ubicacion?: StringFieldUpdateOperationsInput | string
    tipo?: StringFieldUpdateOperationsInput | string
    capacidad?: NullableIntFieldUpdateOperationsInput | number | null
    estado?: BoolFieldUpdateOperationsInput | boolean
  }

  export type DepositoUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    ubicacion?: StringFieldUpdateOperationsInput | string
    tipo?: StringFieldUpdateOperationsInput | string
    capacidad?: NullableIntFieldUpdateOperationsInput | number | null
    estado?: BoolFieldUpdateOperationsInput | boolean
  }

  export type StockPorDepositoCreateInput = {
    stockActual?: number
    stockMinimo?: number
    stockMaximo?: number | null
    capacidadMaxima?: number | null
    detallesMovimiento?: DetalleMovimientoCreateNestedManyWithoutStockInput
    deposito: DepositoCreateNestedOneWithoutStockInput
    producto: ProductoCreateNestedOneWithoutStockProductosInput
  }

  export type StockPorDepositoUncheckedCreateInput = {
    id?: number
    productoId: number
    depositoId: number
    stockActual?: number
    stockMinimo?: number
    stockMaximo?: number | null
    capacidadMaxima?: number | null
    detallesMovimiento?: DetalleMovimientoUncheckedCreateNestedManyWithoutStockInput
  }

  export type StockPorDepositoUpdateInput = {
    stockActual?: IntFieldUpdateOperationsInput | number
    stockMinimo?: IntFieldUpdateOperationsInput | number
    stockMaximo?: NullableIntFieldUpdateOperationsInput | number | null
    capacidadMaxima?: NullableIntFieldUpdateOperationsInput | number | null
    detallesMovimiento?: DetalleMovimientoUpdateManyWithoutStockNestedInput
    deposito?: DepositoUpdateOneRequiredWithoutStockNestedInput
    producto?: ProductoUpdateOneRequiredWithoutStockProductosNestedInput
  }

  export type StockPorDepositoUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    productoId?: IntFieldUpdateOperationsInput | number
    depositoId?: IntFieldUpdateOperationsInput | number
    stockActual?: IntFieldUpdateOperationsInput | number
    stockMinimo?: IntFieldUpdateOperationsInput | number
    stockMaximo?: NullableIntFieldUpdateOperationsInput | number | null
    capacidadMaxima?: NullableIntFieldUpdateOperationsInput | number | null
    detallesMovimiento?: DetalleMovimientoUncheckedUpdateManyWithoutStockNestedInput
  }

  export type StockPorDepositoCreateManyInput = {
    id?: number
    productoId: number
    depositoId: number
    stockActual?: number
    stockMinimo?: number
    stockMaximo?: number | null
    capacidadMaxima?: number | null
  }

  export type StockPorDepositoUpdateManyMutationInput = {
    stockActual?: IntFieldUpdateOperationsInput | number
    stockMinimo?: IntFieldUpdateOperationsInput | number
    stockMaximo?: NullableIntFieldUpdateOperationsInput | number | null
    capacidadMaxima?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type StockPorDepositoUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    productoId?: IntFieldUpdateOperationsInput | number
    depositoId?: IntFieldUpdateOperationsInput | number
    stockActual?: IntFieldUpdateOperationsInput | number
    stockMinimo?: IntFieldUpdateOperationsInput | number
    stockMaximo?: NullableIntFieldUpdateOperationsInput | number | null
    capacidadMaxima?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type MovimientoStockCreateInput = {
    fecha?: Date | string
    hora?: Date | string
    detalles?: DetalleMovimientoCreateNestedManyWithoutMovimientoInput
    deposito: DepositoCreateNestedOneWithoutMovimientosInput
    tipoComprobante: TipoComprobanteCreateNestedOneWithoutMovimientosInput
    tipoMovimiento: TipoMovimientoCreateNestedOneWithoutMovimientosInput
  }

  export type MovimientoStockUncheckedCreateInput = {
    id?: number
    depositoId: number
    tipoMovimientoId: number
    tipoComprobanteId: number
    fecha?: Date | string
    hora?: Date | string
    detalles?: DetalleMovimientoUncheckedCreateNestedManyWithoutMovimientoInput
  }

  export type MovimientoStockUpdateInput = {
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    hora?: DateTimeFieldUpdateOperationsInput | Date | string
    detalles?: DetalleMovimientoUpdateManyWithoutMovimientoNestedInput
    deposito?: DepositoUpdateOneRequiredWithoutMovimientosNestedInput
    tipoComprobante?: TipoComprobanteUpdateOneRequiredWithoutMovimientosNestedInput
    tipoMovimiento?: TipoMovimientoUpdateOneRequiredWithoutMovimientosNestedInput
  }

  export type MovimientoStockUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    depositoId?: IntFieldUpdateOperationsInput | number
    tipoMovimientoId?: IntFieldUpdateOperationsInput | number
    tipoComprobanteId?: IntFieldUpdateOperationsInput | number
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    hora?: DateTimeFieldUpdateOperationsInput | Date | string
    detalles?: DetalleMovimientoUncheckedUpdateManyWithoutMovimientoNestedInput
  }

  export type MovimientoStockCreateManyInput = {
    id?: number
    depositoId: number
    tipoMovimientoId: number
    tipoComprobanteId: number
    fecha?: Date | string
    hora?: Date | string
  }

  export type MovimientoStockUpdateManyMutationInput = {
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    hora?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MovimientoStockUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    depositoId?: IntFieldUpdateOperationsInput | number
    tipoMovimientoId?: IntFieldUpdateOperationsInput | number
    tipoComprobanteId?: IntFieldUpdateOperationsInput | number
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    hora?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DetalleMovimientoCreateInput = {
    cantidad: number
    movimiento: MovimientoStockCreateNestedOneWithoutDetallesInput
    stock: StockPorDepositoCreateNestedOneWithoutDetallesMovimientoInput
  }

  export type DetalleMovimientoUncheckedCreateInput = {
    id?: number
    movimientoId: number
    stockId: number
    cantidad: number
  }

  export type DetalleMovimientoUpdateInput = {
    cantidad?: IntFieldUpdateOperationsInput | number
    movimiento?: MovimientoStockUpdateOneRequiredWithoutDetallesNestedInput
    stock?: StockPorDepositoUpdateOneRequiredWithoutDetallesMovimientoNestedInput
  }

  export type DetalleMovimientoUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    movimientoId?: IntFieldUpdateOperationsInput | number
    stockId?: IntFieldUpdateOperationsInput | number
    cantidad?: IntFieldUpdateOperationsInput | number
  }

  export type DetalleMovimientoCreateManyInput = {
    id?: number
    movimientoId: number
    stockId: number
    cantidad: number
  }

  export type DetalleMovimientoUpdateManyMutationInput = {
    cantidad?: IntFieldUpdateOperationsInput | number
  }

  export type DetalleMovimientoUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    movimientoId?: IntFieldUpdateOperationsInput | number
    stockId?: IntFieldUpdateOperationsInput | number
    cantidad?: IntFieldUpdateOperationsInput | number
  }

  export type TipoComprobanteCreateInput = {
    nombre: string
    movimientos?: MovimientoStockCreateNestedManyWithoutTipoComprobanteInput
  }

  export type TipoComprobanteUncheckedCreateInput = {
    id?: number
    nombre: string
    movimientos?: MovimientoStockUncheckedCreateNestedManyWithoutTipoComprobanteInput
  }

  export type TipoComprobanteUpdateInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    movimientos?: MovimientoStockUpdateManyWithoutTipoComprobanteNestedInput
  }

  export type TipoComprobanteUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    movimientos?: MovimientoStockUncheckedUpdateManyWithoutTipoComprobanteNestedInput
  }

  export type TipoComprobanteCreateManyInput = {
    id?: number
    nombre: string
  }

  export type TipoComprobanteUpdateManyMutationInput = {
    nombre?: StringFieldUpdateOperationsInput | string
  }

  export type TipoComprobanteUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
  }

  export type TipoMovimientoCreateInput = {
    nombre: string
    ingresoEgreso: boolean
    movimientos?: MovimientoStockCreateNestedManyWithoutTipoMovimientoInput
  }

  export type TipoMovimientoUncheckedCreateInput = {
    id?: number
    nombre: string
    ingresoEgreso: boolean
    movimientos?: MovimientoStockUncheckedCreateNestedManyWithoutTipoMovimientoInput
  }

  export type TipoMovimientoUpdateInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    ingresoEgreso?: BoolFieldUpdateOperationsInput | boolean
    movimientos?: MovimientoStockUpdateManyWithoutTipoMovimientoNestedInput
  }

  export type TipoMovimientoUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    ingresoEgreso?: BoolFieldUpdateOperationsInput | boolean
    movimientos?: MovimientoStockUncheckedUpdateManyWithoutTipoMovimientoNestedInput
  }

  export type TipoMovimientoCreateManyInput = {
    id?: number
    nombre: string
    ingresoEgreso: boolean
  }

  export type TipoMovimientoUpdateManyMutationInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    ingresoEgreso?: BoolFieldUpdateOperationsInput | boolean
  }

  export type TipoMovimientoUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    ingresoEgreso?: BoolFieldUpdateOperationsInput | boolean
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type ProductoListRelationFilter = {
    every?: ProductoWhereInput
    some?: ProductoWhereInput
    none?: ProductoWhereInput
  }

  export type ProductoOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RubroCountOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
  }

  export type RubroAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type RubroMaxOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
  }

  export type RubroMinOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
  }

  export type RubroSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type UnidadCountOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
  }

  export type UnidadAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type UnidadMaxOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
  }

  export type UnidadMinOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
  }

  export type UnidadSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type MarcaCountOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
  }

  export type MarcaAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type MarcaMaxOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
  }

  export type MarcaMinOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
  }

  export type MarcaSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type MarcaScalarRelationFilter = {
    is?: MarcaWhereInput
    isNot?: MarcaWhereInput
  }

  export type RubroScalarRelationFilter = {
    is?: RubroWhereInput
    isNot?: RubroWhereInput
  }

  export type UnidadScalarRelationFilter = {
    is?: UnidadWhereInput
    isNot?: UnidadWhereInput
  }

  export type StockPorDepositoListRelationFilter = {
    every?: StockPorDepositoWhereInput
    some?: StockPorDepositoWhereInput
    none?: StockPorDepositoWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type StockPorDepositoOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProductoCountOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    descripcion?: SortOrder
    rubroId?: SortOrder
    marcaId?: SortOrder
    unidadId?: SortOrder
    precioCompra?: SortOrder
    precioVenta?: SortOrder
    estado?: SortOrder
  }

  export type ProductoAvgOrderByAggregateInput = {
    id?: SortOrder
    rubroId?: SortOrder
    marcaId?: SortOrder
    unidadId?: SortOrder
    precioCompra?: SortOrder
    precioVenta?: SortOrder
  }

  export type ProductoMaxOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    descripcion?: SortOrder
    rubroId?: SortOrder
    marcaId?: SortOrder
    unidadId?: SortOrder
    precioCompra?: SortOrder
    precioVenta?: SortOrder
    estado?: SortOrder
  }

  export type ProductoMinOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    descripcion?: SortOrder
    rubroId?: SortOrder
    marcaId?: SortOrder
    unidadId?: SortOrder
    precioCompra?: SortOrder
    precioVenta?: SortOrder
    estado?: SortOrder
  }

  export type ProductoSumOrderByAggregateInput = {
    id?: SortOrder
    rubroId?: SortOrder
    marcaId?: SortOrder
    unidadId?: SortOrder
    precioCompra?: SortOrder
    precioVenta?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type MovimientoStockListRelationFilter = {
    every?: MovimientoStockWhereInput
    some?: MovimientoStockWhereInput
    none?: MovimientoStockWhereInput
  }

  export type MovimientoStockOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DepositoCountOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    ubicacion?: SortOrder
    tipo?: SortOrder
    capacidad?: SortOrder
    estado?: SortOrder
  }

  export type DepositoAvgOrderByAggregateInput = {
    id?: SortOrder
    capacidad?: SortOrder
  }

  export type DepositoMaxOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    ubicacion?: SortOrder
    tipo?: SortOrder
    capacidad?: SortOrder
    estado?: SortOrder
  }

  export type DepositoMinOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    ubicacion?: SortOrder
    tipo?: SortOrder
    capacidad?: SortOrder
    estado?: SortOrder
  }

  export type DepositoSumOrderByAggregateInput = {
    id?: SortOrder
    capacidad?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type DetalleMovimientoListRelationFilter = {
    every?: DetalleMovimientoWhereInput
    some?: DetalleMovimientoWhereInput
    none?: DetalleMovimientoWhereInput
  }

  export type DepositoScalarRelationFilter = {
    is?: DepositoWhereInput
    isNot?: DepositoWhereInput
  }

  export type ProductoScalarRelationFilter = {
    is?: ProductoWhereInput
    isNot?: ProductoWhereInput
  }

  export type DetalleMovimientoOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type StockPorDepositoProductoIdDepositoIdCompoundUniqueInput = {
    productoId: number
    depositoId: number
  }

  export type StockPorDepositoCountOrderByAggregateInput = {
    id?: SortOrder
    productoId?: SortOrder
    depositoId?: SortOrder
    stockActual?: SortOrder
    stockMinimo?: SortOrder
    stockMaximo?: SortOrder
    capacidadMaxima?: SortOrder
  }

  export type StockPorDepositoAvgOrderByAggregateInput = {
    id?: SortOrder
    productoId?: SortOrder
    depositoId?: SortOrder
    stockActual?: SortOrder
    stockMinimo?: SortOrder
    stockMaximo?: SortOrder
    capacidadMaxima?: SortOrder
  }

  export type StockPorDepositoMaxOrderByAggregateInput = {
    id?: SortOrder
    productoId?: SortOrder
    depositoId?: SortOrder
    stockActual?: SortOrder
    stockMinimo?: SortOrder
    stockMaximo?: SortOrder
    capacidadMaxima?: SortOrder
  }

  export type StockPorDepositoMinOrderByAggregateInput = {
    id?: SortOrder
    productoId?: SortOrder
    depositoId?: SortOrder
    stockActual?: SortOrder
    stockMinimo?: SortOrder
    stockMaximo?: SortOrder
    capacidadMaxima?: SortOrder
  }

  export type StockPorDepositoSumOrderByAggregateInput = {
    id?: SortOrder
    productoId?: SortOrder
    depositoId?: SortOrder
    stockActual?: SortOrder
    stockMinimo?: SortOrder
    stockMaximo?: SortOrder
    capacidadMaxima?: SortOrder
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type TipoComprobanteScalarRelationFilter = {
    is?: TipoComprobanteWhereInput
    isNot?: TipoComprobanteWhereInput
  }

  export type TipoMovimientoScalarRelationFilter = {
    is?: TipoMovimientoWhereInput
    isNot?: TipoMovimientoWhereInput
  }

  export type MovimientoStockCountOrderByAggregateInput = {
    id?: SortOrder
    depositoId?: SortOrder
    tipoMovimientoId?: SortOrder
    tipoComprobanteId?: SortOrder
    fecha?: SortOrder
    hora?: SortOrder
  }

  export type MovimientoStockAvgOrderByAggregateInput = {
    id?: SortOrder
    depositoId?: SortOrder
    tipoMovimientoId?: SortOrder
    tipoComprobanteId?: SortOrder
  }

  export type MovimientoStockMaxOrderByAggregateInput = {
    id?: SortOrder
    depositoId?: SortOrder
    tipoMovimientoId?: SortOrder
    tipoComprobanteId?: SortOrder
    fecha?: SortOrder
    hora?: SortOrder
  }

  export type MovimientoStockMinOrderByAggregateInput = {
    id?: SortOrder
    depositoId?: SortOrder
    tipoMovimientoId?: SortOrder
    tipoComprobanteId?: SortOrder
    fecha?: SortOrder
    hora?: SortOrder
  }

  export type MovimientoStockSumOrderByAggregateInput = {
    id?: SortOrder
    depositoId?: SortOrder
    tipoMovimientoId?: SortOrder
    tipoComprobanteId?: SortOrder
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type MovimientoStockScalarRelationFilter = {
    is?: MovimientoStockWhereInput
    isNot?: MovimientoStockWhereInput
  }

  export type StockPorDepositoScalarRelationFilter = {
    is?: StockPorDepositoWhereInput
    isNot?: StockPorDepositoWhereInput
  }

  export type DetalleMovimientoCountOrderByAggregateInput = {
    id?: SortOrder
    movimientoId?: SortOrder
    stockId?: SortOrder
    cantidad?: SortOrder
  }

  export type DetalleMovimientoAvgOrderByAggregateInput = {
    id?: SortOrder
    movimientoId?: SortOrder
    stockId?: SortOrder
    cantidad?: SortOrder
  }

  export type DetalleMovimientoMaxOrderByAggregateInput = {
    id?: SortOrder
    movimientoId?: SortOrder
    stockId?: SortOrder
    cantidad?: SortOrder
  }

  export type DetalleMovimientoMinOrderByAggregateInput = {
    id?: SortOrder
    movimientoId?: SortOrder
    stockId?: SortOrder
    cantidad?: SortOrder
  }

  export type DetalleMovimientoSumOrderByAggregateInput = {
    id?: SortOrder
    movimientoId?: SortOrder
    stockId?: SortOrder
    cantidad?: SortOrder
  }

  export type TipoComprobanteCountOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
  }

  export type TipoComprobanteAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type TipoComprobanteMaxOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
  }

  export type TipoComprobanteMinOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
  }

  export type TipoComprobanteSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type TipoMovimientoCountOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    ingresoEgreso?: SortOrder
  }

  export type TipoMovimientoAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type TipoMovimientoMaxOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    ingresoEgreso?: SortOrder
  }

  export type TipoMovimientoMinOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    ingresoEgreso?: SortOrder
  }

  export type TipoMovimientoSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type ProductoCreateNestedManyWithoutRubroInput = {
    create?: XOR<ProductoCreateWithoutRubroInput, ProductoUncheckedCreateWithoutRubroInput> | ProductoCreateWithoutRubroInput[] | ProductoUncheckedCreateWithoutRubroInput[]
    connectOrCreate?: ProductoCreateOrConnectWithoutRubroInput | ProductoCreateOrConnectWithoutRubroInput[]
    createMany?: ProductoCreateManyRubroInputEnvelope
    connect?: ProductoWhereUniqueInput | ProductoWhereUniqueInput[]
  }

  export type ProductoUncheckedCreateNestedManyWithoutRubroInput = {
    create?: XOR<ProductoCreateWithoutRubroInput, ProductoUncheckedCreateWithoutRubroInput> | ProductoCreateWithoutRubroInput[] | ProductoUncheckedCreateWithoutRubroInput[]
    connectOrCreate?: ProductoCreateOrConnectWithoutRubroInput | ProductoCreateOrConnectWithoutRubroInput[]
    createMany?: ProductoCreateManyRubroInputEnvelope
    connect?: ProductoWhereUniqueInput | ProductoWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type ProductoUpdateManyWithoutRubroNestedInput = {
    create?: XOR<ProductoCreateWithoutRubroInput, ProductoUncheckedCreateWithoutRubroInput> | ProductoCreateWithoutRubroInput[] | ProductoUncheckedCreateWithoutRubroInput[]
    connectOrCreate?: ProductoCreateOrConnectWithoutRubroInput | ProductoCreateOrConnectWithoutRubroInput[]
    upsert?: ProductoUpsertWithWhereUniqueWithoutRubroInput | ProductoUpsertWithWhereUniqueWithoutRubroInput[]
    createMany?: ProductoCreateManyRubroInputEnvelope
    set?: ProductoWhereUniqueInput | ProductoWhereUniqueInput[]
    disconnect?: ProductoWhereUniqueInput | ProductoWhereUniqueInput[]
    delete?: ProductoWhereUniqueInput | ProductoWhereUniqueInput[]
    connect?: ProductoWhereUniqueInput | ProductoWhereUniqueInput[]
    update?: ProductoUpdateWithWhereUniqueWithoutRubroInput | ProductoUpdateWithWhereUniqueWithoutRubroInput[]
    updateMany?: ProductoUpdateManyWithWhereWithoutRubroInput | ProductoUpdateManyWithWhereWithoutRubroInput[]
    deleteMany?: ProductoScalarWhereInput | ProductoScalarWhereInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type ProductoUncheckedUpdateManyWithoutRubroNestedInput = {
    create?: XOR<ProductoCreateWithoutRubroInput, ProductoUncheckedCreateWithoutRubroInput> | ProductoCreateWithoutRubroInput[] | ProductoUncheckedCreateWithoutRubroInput[]
    connectOrCreate?: ProductoCreateOrConnectWithoutRubroInput | ProductoCreateOrConnectWithoutRubroInput[]
    upsert?: ProductoUpsertWithWhereUniqueWithoutRubroInput | ProductoUpsertWithWhereUniqueWithoutRubroInput[]
    createMany?: ProductoCreateManyRubroInputEnvelope
    set?: ProductoWhereUniqueInput | ProductoWhereUniqueInput[]
    disconnect?: ProductoWhereUniqueInput | ProductoWhereUniqueInput[]
    delete?: ProductoWhereUniqueInput | ProductoWhereUniqueInput[]
    connect?: ProductoWhereUniqueInput | ProductoWhereUniqueInput[]
    update?: ProductoUpdateWithWhereUniqueWithoutRubroInput | ProductoUpdateWithWhereUniqueWithoutRubroInput[]
    updateMany?: ProductoUpdateManyWithWhereWithoutRubroInput | ProductoUpdateManyWithWhereWithoutRubroInput[]
    deleteMany?: ProductoScalarWhereInput | ProductoScalarWhereInput[]
  }

  export type ProductoCreateNestedManyWithoutUnidadInput = {
    create?: XOR<ProductoCreateWithoutUnidadInput, ProductoUncheckedCreateWithoutUnidadInput> | ProductoCreateWithoutUnidadInput[] | ProductoUncheckedCreateWithoutUnidadInput[]
    connectOrCreate?: ProductoCreateOrConnectWithoutUnidadInput | ProductoCreateOrConnectWithoutUnidadInput[]
    createMany?: ProductoCreateManyUnidadInputEnvelope
    connect?: ProductoWhereUniqueInput | ProductoWhereUniqueInput[]
  }

  export type ProductoUncheckedCreateNestedManyWithoutUnidadInput = {
    create?: XOR<ProductoCreateWithoutUnidadInput, ProductoUncheckedCreateWithoutUnidadInput> | ProductoCreateWithoutUnidadInput[] | ProductoUncheckedCreateWithoutUnidadInput[]
    connectOrCreate?: ProductoCreateOrConnectWithoutUnidadInput | ProductoCreateOrConnectWithoutUnidadInput[]
    createMany?: ProductoCreateManyUnidadInputEnvelope
    connect?: ProductoWhereUniqueInput | ProductoWhereUniqueInput[]
  }

  export type ProductoUpdateManyWithoutUnidadNestedInput = {
    create?: XOR<ProductoCreateWithoutUnidadInput, ProductoUncheckedCreateWithoutUnidadInput> | ProductoCreateWithoutUnidadInput[] | ProductoUncheckedCreateWithoutUnidadInput[]
    connectOrCreate?: ProductoCreateOrConnectWithoutUnidadInput | ProductoCreateOrConnectWithoutUnidadInput[]
    upsert?: ProductoUpsertWithWhereUniqueWithoutUnidadInput | ProductoUpsertWithWhereUniqueWithoutUnidadInput[]
    createMany?: ProductoCreateManyUnidadInputEnvelope
    set?: ProductoWhereUniqueInput | ProductoWhereUniqueInput[]
    disconnect?: ProductoWhereUniqueInput | ProductoWhereUniqueInput[]
    delete?: ProductoWhereUniqueInput | ProductoWhereUniqueInput[]
    connect?: ProductoWhereUniqueInput | ProductoWhereUniqueInput[]
    update?: ProductoUpdateWithWhereUniqueWithoutUnidadInput | ProductoUpdateWithWhereUniqueWithoutUnidadInput[]
    updateMany?: ProductoUpdateManyWithWhereWithoutUnidadInput | ProductoUpdateManyWithWhereWithoutUnidadInput[]
    deleteMany?: ProductoScalarWhereInput | ProductoScalarWhereInput[]
  }

  export type ProductoUncheckedUpdateManyWithoutUnidadNestedInput = {
    create?: XOR<ProductoCreateWithoutUnidadInput, ProductoUncheckedCreateWithoutUnidadInput> | ProductoCreateWithoutUnidadInput[] | ProductoUncheckedCreateWithoutUnidadInput[]
    connectOrCreate?: ProductoCreateOrConnectWithoutUnidadInput | ProductoCreateOrConnectWithoutUnidadInput[]
    upsert?: ProductoUpsertWithWhereUniqueWithoutUnidadInput | ProductoUpsertWithWhereUniqueWithoutUnidadInput[]
    createMany?: ProductoCreateManyUnidadInputEnvelope
    set?: ProductoWhereUniqueInput | ProductoWhereUniqueInput[]
    disconnect?: ProductoWhereUniqueInput | ProductoWhereUniqueInput[]
    delete?: ProductoWhereUniqueInput | ProductoWhereUniqueInput[]
    connect?: ProductoWhereUniqueInput | ProductoWhereUniqueInput[]
    update?: ProductoUpdateWithWhereUniqueWithoutUnidadInput | ProductoUpdateWithWhereUniqueWithoutUnidadInput[]
    updateMany?: ProductoUpdateManyWithWhereWithoutUnidadInput | ProductoUpdateManyWithWhereWithoutUnidadInput[]
    deleteMany?: ProductoScalarWhereInput | ProductoScalarWhereInput[]
  }

  export type ProductoCreateNestedManyWithoutMarcaInput = {
    create?: XOR<ProductoCreateWithoutMarcaInput, ProductoUncheckedCreateWithoutMarcaInput> | ProductoCreateWithoutMarcaInput[] | ProductoUncheckedCreateWithoutMarcaInput[]
    connectOrCreate?: ProductoCreateOrConnectWithoutMarcaInput | ProductoCreateOrConnectWithoutMarcaInput[]
    createMany?: ProductoCreateManyMarcaInputEnvelope
    connect?: ProductoWhereUniqueInput | ProductoWhereUniqueInput[]
  }

  export type ProductoUncheckedCreateNestedManyWithoutMarcaInput = {
    create?: XOR<ProductoCreateWithoutMarcaInput, ProductoUncheckedCreateWithoutMarcaInput> | ProductoCreateWithoutMarcaInput[] | ProductoUncheckedCreateWithoutMarcaInput[]
    connectOrCreate?: ProductoCreateOrConnectWithoutMarcaInput | ProductoCreateOrConnectWithoutMarcaInput[]
    createMany?: ProductoCreateManyMarcaInputEnvelope
    connect?: ProductoWhereUniqueInput | ProductoWhereUniqueInput[]
  }

  export type ProductoUpdateManyWithoutMarcaNestedInput = {
    create?: XOR<ProductoCreateWithoutMarcaInput, ProductoUncheckedCreateWithoutMarcaInput> | ProductoCreateWithoutMarcaInput[] | ProductoUncheckedCreateWithoutMarcaInput[]
    connectOrCreate?: ProductoCreateOrConnectWithoutMarcaInput | ProductoCreateOrConnectWithoutMarcaInput[]
    upsert?: ProductoUpsertWithWhereUniqueWithoutMarcaInput | ProductoUpsertWithWhereUniqueWithoutMarcaInput[]
    createMany?: ProductoCreateManyMarcaInputEnvelope
    set?: ProductoWhereUniqueInput | ProductoWhereUniqueInput[]
    disconnect?: ProductoWhereUniqueInput | ProductoWhereUniqueInput[]
    delete?: ProductoWhereUniqueInput | ProductoWhereUniqueInput[]
    connect?: ProductoWhereUniqueInput | ProductoWhereUniqueInput[]
    update?: ProductoUpdateWithWhereUniqueWithoutMarcaInput | ProductoUpdateWithWhereUniqueWithoutMarcaInput[]
    updateMany?: ProductoUpdateManyWithWhereWithoutMarcaInput | ProductoUpdateManyWithWhereWithoutMarcaInput[]
    deleteMany?: ProductoScalarWhereInput | ProductoScalarWhereInput[]
  }

  export type ProductoUncheckedUpdateManyWithoutMarcaNestedInput = {
    create?: XOR<ProductoCreateWithoutMarcaInput, ProductoUncheckedCreateWithoutMarcaInput> | ProductoCreateWithoutMarcaInput[] | ProductoUncheckedCreateWithoutMarcaInput[]
    connectOrCreate?: ProductoCreateOrConnectWithoutMarcaInput | ProductoCreateOrConnectWithoutMarcaInput[]
    upsert?: ProductoUpsertWithWhereUniqueWithoutMarcaInput | ProductoUpsertWithWhereUniqueWithoutMarcaInput[]
    createMany?: ProductoCreateManyMarcaInputEnvelope
    set?: ProductoWhereUniqueInput | ProductoWhereUniqueInput[]
    disconnect?: ProductoWhereUniqueInput | ProductoWhereUniqueInput[]
    delete?: ProductoWhereUniqueInput | ProductoWhereUniqueInput[]
    connect?: ProductoWhereUniqueInput | ProductoWhereUniqueInput[]
    update?: ProductoUpdateWithWhereUniqueWithoutMarcaInput | ProductoUpdateWithWhereUniqueWithoutMarcaInput[]
    updateMany?: ProductoUpdateManyWithWhereWithoutMarcaInput | ProductoUpdateManyWithWhereWithoutMarcaInput[]
    deleteMany?: ProductoScalarWhereInput | ProductoScalarWhereInput[]
  }

  export type MarcaCreateNestedOneWithoutProductosInput = {
    create?: XOR<MarcaCreateWithoutProductosInput, MarcaUncheckedCreateWithoutProductosInput>
    connectOrCreate?: MarcaCreateOrConnectWithoutProductosInput
    connect?: MarcaWhereUniqueInput
  }

  export type RubroCreateNestedOneWithoutProductosInput = {
    create?: XOR<RubroCreateWithoutProductosInput, RubroUncheckedCreateWithoutProductosInput>
    connectOrCreate?: RubroCreateOrConnectWithoutProductosInput
    connect?: RubroWhereUniqueInput
  }

  export type UnidadCreateNestedOneWithoutProductosInput = {
    create?: XOR<UnidadCreateWithoutProductosInput, UnidadUncheckedCreateWithoutProductosInput>
    connectOrCreate?: UnidadCreateOrConnectWithoutProductosInput
    connect?: UnidadWhereUniqueInput
  }

  export type StockPorDepositoCreateNestedManyWithoutProductoInput = {
    create?: XOR<StockPorDepositoCreateWithoutProductoInput, StockPorDepositoUncheckedCreateWithoutProductoInput> | StockPorDepositoCreateWithoutProductoInput[] | StockPorDepositoUncheckedCreateWithoutProductoInput[]
    connectOrCreate?: StockPorDepositoCreateOrConnectWithoutProductoInput | StockPorDepositoCreateOrConnectWithoutProductoInput[]
    createMany?: StockPorDepositoCreateManyProductoInputEnvelope
    connect?: StockPorDepositoWhereUniqueInput | StockPorDepositoWhereUniqueInput[]
  }

  export type StockPorDepositoUncheckedCreateNestedManyWithoutProductoInput = {
    create?: XOR<StockPorDepositoCreateWithoutProductoInput, StockPorDepositoUncheckedCreateWithoutProductoInput> | StockPorDepositoCreateWithoutProductoInput[] | StockPorDepositoUncheckedCreateWithoutProductoInput[]
    connectOrCreate?: StockPorDepositoCreateOrConnectWithoutProductoInput | StockPorDepositoCreateOrConnectWithoutProductoInput[]
    createMany?: StockPorDepositoCreateManyProductoInputEnvelope
    connect?: StockPorDepositoWhereUniqueInput | StockPorDepositoWhereUniqueInput[]
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type MarcaUpdateOneRequiredWithoutProductosNestedInput = {
    create?: XOR<MarcaCreateWithoutProductosInput, MarcaUncheckedCreateWithoutProductosInput>
    connectOrCreate?: MarcaCreateOrConnectWithoutProductosInput
    upsert?: MarcaUpsertWithoutProductosInput
    connect?: MarcaWhereUniqueInput
    update?: XOR<XOR<MarcaUpdateToOneWithWhereWithoutProductosInput, MarcaUpdateWithoutProductosInput>, MarcaUncheckedUpdateWithoutProductosInput>
  }

  export type RubroUpdateOneRequiredWithoutProductosNestedInput = {
    create?: XOR<RubroCreateWithoutProductosInput, RubroUncheckedCreateWithoutProductosInput>
    connectOrCreate?: RubroCreateOrConnectWithoutProductosInput
    upsert?: RubroUpsertWithoutProductosInput
    connect?: RubroWhereUniqueInput
    update?: XOR<XOR<RubroUpdateToOneWithWhereWithoutProductosInput, RubroUpdateWithoutProductosInput>, RubroUncheckedUpdateWithoutProductosInput>
  }

  export type UnidadUpdateOneRequiredWithoutProductosNestedInput = {
    create?: XOR<UnidadCreateWithoutProductosInput, UnidadUncheckedCreateWithoutProductosInput>
    connectOrCreate?: UnidadCreateOrConnectWithoutProductosInput
    upsert?: UnidadUpsertWithoutProductosInput
    connect?: UnidadWhereUniqueInput
    update?: XOR<XOR<UnidadUpdateToOneWithWhereWithoutProductosInput, UnidadUpdateWithoutProductosInput>, UnidadUncheckedUpdateWithoutProductosInput>
  }

  export type StockPorDepositoUpdateManyWithoutProductoNestedInput = {
    create?: XOR<StockPorDepositoCreateWithoutProductoInput, StockPorDepositoUncheckedCreateWithoutProductoInput> | StockPorDepositoCreateWithoutProductoInput[] | StockPorDepositoUncheckedCreateWithoutProductoInput[]
    connectOrCreate?: StockPorDepositoCreateOrConnectWithoutProductoInput | StockPorDepositoCreateOrConnectWithoutProductoInput[]
    upsert?: StockPorDepositoUpsertWithWhereUniqueWithoutProductoInput | StockPorDepositoUpsertWithWhereUniqueWithoutProductoInput[]
    createMany?: StockPorDepositoCreateManyProductoInputEnvelope
    set?: StockPorDepositoWhereUniqueInput | StockPorDepositoWhereUniqueInput[]
    disconnect?: StockPorDepositoWhereUniqueInput | StockPorDepositoWhereUniqueInput[]
    delete?: StockPorDepositoWhereUniqueInput | StockPorDepositoWhereUniqueInput[]
    connect?: StockPorDepositoWhereUniqueInput | StockPorDepositoWhereUniqueInput[]
    update?: StockPorDepositoUpdateWithWhereUniqueWithoutProductoInput | StockPorDepositoUpdateWithWhereUniqueWithoutProductoInput[]
    updateMany?: StockPorDepositoUpdateManyWithWhereWithoutProductoInput | StockPorDepositoUpdateManyWithWhereWithoutProductoInput[]
    deleteMany?: StockPorDepositoScalarWhereInput | StockPorDepositoScalarWhereInput[]
  }

  export type StockPorDepositoUncheckedUpdateManyWithoutProductoNestedInput = {
    create?: XOR<StockPorDepositoCreateWithoutProductoInput, StockPorDepositoUncheckedCreateWithoutProductoInput> | StockPorDepositoCreateWithoutProductoInput[] | StockPorDepositoUncheckedCreateWithoutProductoInput[]
    connectOrCreate?: StockPorDepositoCreateOrConnectWithoutProductoInput | StockPorDepositoCreateOrConnectWithoutProductoInput[]
    upsert?: StockPorDepositoUpsertWithWhereUniqueWithoutProductoInput | StockPorDepositoUpsertWithWhereUniqueWithoutProductoInput[]
    createMany?: StockPorDepositoCreateManyProductoInputEnvelope
    set?: StockPorDepositoWhereUniqueInput | StockPorDepositoWhereUniqueInput[]
    disconnect?: StockPorDepositoWhereUniqueInput | StockPorDepositoWhereUniqueInput[]
    delete?: StockPorDepositoWhereUniqueInput | StockPorDepositoWhereUniqueInput[]
    connect?: StockPorDepositoWhereUniqueInput | StockPorDepositoWhereUniqueInput[]
    update?: StockPorDepositoUpdateWithWhereUniqueWithoutProductoInput | StockPorDepositoUpdateWithWhereUniqueWithoutProductoInput[]
    updateMany?: StockPorDepositoUpdateManyWithWhereWithoutProductoInput | StockPorDepositoUpdateManyWithWhereWithoutProductoInput[]
    deleteMany?: StockPorDepositoScalarWhereInput | StockPorDepositoScalarWhereInput[]
  }

  export type MovimientoStockCreateNestedManyWithoutDepositoInput = {
    create?: XOR<MovimientoStockCreateWithoutDepositoInput, MovimientoStockUncheckedCreateWithoutDepositoInput> | MovimientoStockCreateWithoutDepositoInput[] | MovimientoStockUncheckedCreateWithoutDepositoInput[]
    connectOrCreate?: MovimientoStockCreateOrConnectWithoutDepositoInput | MovimientoStockCreateOrConnectWithoutDepositoInput[]
    createMany?: MovimientoStockCreateManyDepositoInputEnvelope
    connect?: MovimientoStockWhereUniqueInput | MovimientoStockWhereUniqueInput[]
  }

  export type StockPorDepositoCreateNestedManyWithoutDepositoInput = {
    create?: XOR<StockPorDepositoCreateWithoutDepositoInput, StockPorDepositoUncheckedCreateWithoutDepositoInput> | StockPorDepositoCreateWithoutDepositoInput[] | StockPorDepositoUncheckedCreateWithoutDepositoInput[]
    connectOrCreate?: StockPorDepositoCreateOrConnectWithoutDepositoInput | StockPorDepositoCreateOrConnectWithoutDepositoInput[]
    createMany?: StockPorDepositoCreateManyDepositoInputEnvelope
    connect?: StockPorDepositoWhereUniqueInput | StockPorDepositoWhereUniqueInput[]
  }

  export type MovimientoStockUncheckedCreateNestedManyWithoutDepositoInput = {
    create?: XOR<MovimientoStockCreateWithoutDepositoInput, MovimientoStockUncheckedCreateWithoutDepositoInput> | MovimientoStockCreateWithoutDepositoInput[] | MovimientoStockUncheckedCreateWithoutDepositoInput[]
    connectOrCreate?: MovimientoStockCreateOrConnectWithoutDepositoInput | MovimientoStockCreateOrConnectWithoutDepositoInput[]
    createMany?: MovimientoStockCreateManyDepositoInputEnvelope
    connect?: MovimientoStockWhereUniqueInput | MovimientoStockWhereUniqueInput[]
  }

  export type StockPorDepositoUncheckedCreateNestedManyWithoutDepositoInput = {
    create?: XOR<StockPorDepositoCreateWithoutDepositoInput, StockPorDepositoUncheckedCreateWithoutDepositoInput> | StockPorDepositoCreateWithoutDepositoInput[] | StockPorDepositoUncheckedCreateWithoutDepositoInput[]
    connectOrCreate?: StockPorDepositoCreateOrConnectWithoutDepositoInput | StockPorDepositoCreateOrConnectWithoutDepositoInput[]
    createMany?: StockPorDepositoCreateManyDepositoInputEnvelope
    connect?: StockPorDepositoWhereUniqueInput | StockPorDepositoWhereUniqueInput[]
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type MovimientoStockUpdateManyWithoutDepositoNestedInput = {
    create?: XOR<MovimientoStockCreateWithoutDepositoInput, MovimientoStockUncheckedCreateWithoutDepositoInput> | MovimientoStockCreateWithoutDepositoInput[] | MovimientoStockUncheckedCreateWithoutDepositoInput[]
    connectOrCreate?: MovimientoStockCreateOrConnectWithoutDepositoInput | MovimientoStockCreateOrConnectWithoutDepositoInput[]
    upsert?: MovimientoStockUpsertWithWhereUniqueWithoutDepositoInput | MovimientoStockUpsertWithWhereUniqueWithoutDepositoInput[]
    createMany?: MovimientoStockCreateManyDepositoInputEnvelope
    set?: MovimientoStockWhereUniqueInput | MovimientoStockWhereUniqueInput[]
    disconnect?: MovimientoStockWhereUniqueInput | MovimientoStockWhereUniqueInput[]
    delete?: MovimientoStockWhereUniqueInput | MovimientoStockWhereUniqueInput[]
    connect?: MovimientoStockWhereUniqueInput | MovimientoStockWhereUniqueInput[]
    update?: MovimientoStockUpdateWithWhereUniqueWithoutDepositoInput | MovimientoStockUpdateWithWhereUniqueWithoutDepositoInput[]
    updateMany?: MovimientoStockUpdateManyWithWhereWithoutDepositoInput | MovimientoStockUpdateManyWithWhereWithoutDepositoInput[]
    deleteMany?: MovimientoStockScalarWhereInput | MovimientoStockScalarWhereInput[]
  }

  export type StockPorDepositoUpdateManyWithoutDepositoNestedInput = {
    create?: XOR<StockPorDepositoCreateWithoutDepositoInput, StockPorDepositoUncheckedCreateWithoutDepositoInput> | StockPorDepositoCreateWithoutDepositoInput[] | StockPorDepositoUncheckedCreateWithoutDepositoInput[]
    connectOrCreate?: StockPorDepositoCreateOrConnectWithoutDepositoInput | StockPorDepositoCreateOrConnectWithoutDepositoInput[]
    upsert?: StockPorDepositoUpsertWithWhereUniqueWithoutDepositoInput | StockPorDepositoUpsertWithWhereUniqueWithoutDepositoInput[]
    createMany?: StockPorDepositoCreateManyDepositoInputEnvelope
    set?: StockPorDepositoWhereUniqueInput | StockPorDepositoWhereUniqueInput[]
    disconnect?: StockPorDepositoWhereUniqueInput | StockPorDepositoWhereUniqueInput[]
    delete?: StockPorDepositoWhereUniqueInput | StockPorDepositoWhereUniqueInput[]
    connect?: StockPorDepositoWhereUniqueInput | StockPorDepositoWhereUniqueInput[]
    update?: StockPorDepositoUpdateWithWhereUniqueWithoutDepositoInput | StockPorDepositoUpdateWithWhereUniqueWithoutDepositoInput[]
    updateMany?: StockPorDepositoUpdateManyWithWhereWithoutDepositoInput | StockPorDepositoUpdateManyWithWhereWithoutDepositoInput[]
    deleteMany?: StockPorDepositoScalarWhereInput | StockPorDepositoScalarWhereInput[]
  }

  export type MovimientoStockUncheckedUpdateManyWithoutDepositoNestedInput = {
    create?: XOR<MovimientoStockCreateWithoutDepositoInput, MovimientoStockUncheckedCreateWithoutDepositoInput> | MovimientoStockCreateWithoutDepositoInput[] | MovimientoStockUncheckedCreateWithoutDepositoInput[]
    connectOrCreate?: MovimientoStockCreateOrConnectWithoutDepositoInput | MovimientoStockCreateOrConnectWithoutDepositoInput[]
    upsert?: MovimientoStockUpsertWithWhereUniqueWithoutDepositoInput | MovimientoStockUpsertWithWhereUniqueWithoutDepositoInput[]
    createMany?: MovimientoStockCreateManyDepositoInputEnvelope
    set?: MovimientoStockWhereUniqueInput | MovimientoStockWhereUniqueInput[]
    disconnect?: MovimientoStockWhereUniqueInput | MovimientoStockWhereUniqueInput[]
    delete?: MovimientoStockWhereUniqueInput | MovimientoStockWhereUniqueInput[]
    connect?: MovimientoStockWhereUniqueInput | MovimientoStockWhereUniqueInput[]
    update?: MovimientoStockUpdateWithWhereUniqueWithoutDepositoInput | MovimientoStockUpdateWithWhereUniqueWithoutDepositoInput[]
    updateMany?: MovimientoStockUpdateManyWithWhereWithoutDepositoInput | MovimientoStockUpdateManyWithWhereWithoutDepositoInput[]
    deleteMany?: MovimientoStockScalarWhereInput | MovimientoStockScalarWhereInput[]
  }

  export type StockPorDepositoUncheckedUpdateManyWithoutDepositoNestedInput = {
    create?: XOR<StockPorDepositoCreateWithoutDepositoInput, StockPorDepositoUncheckedCreateWithoutDepositoInput> | StockPorDepositoCreateWithoutDepositoInput[] | StockPorDepositoUncheckedCreateWithoutDepositoInput[]
    connectOrCreate?: StockPorDepositoCreateOrConnectWithoutDepositoInput | StockPorDepositoCreateOrConnectWithoutDepositoInput[]
    upsert?: StockPorDepositoUpsertWithWhereUniqueWithoutDepositoInput | StockPorDepositoUpsertWithWhereUniqueWithoutDepositoInput[]
    createMany?: StockPorDepositoCreateManyDepositoInputEnvelope
    set?: StockPorDepositoWhereUniqueInput | StockPorDepositoWhereUniqueInput[]
    disconnect?: StockPorDepositoWhereUniqueInput | StockPorDepositoWhereUniqueInput[]
    delete?: StockPorDepositoWhereUniqueInput | StockPorDepositoWhereUniqueInput[]
    connect?: StockPorDepositoWhereUniqueInput | StockPorDepositoWhereUniqueInput[]
    update?: StockPorDepositoUpdateWithWhereUniqueWithoutDepositoInput | StockPorDepositoUpdateWithWhereUniqueWithoutDepositoInput[]
    updateMany?: StockPorDepositoUpdateManyWithWhereWithoutDepositoInput | StockPorDepositoUpdateManyWithWhereWithoutDepositoInput[]
    deleteMany?: StockPorDepositoScalarWhereInput | StockPorDepositoScalarWhereInput[]
  }

  export type DetalleMovimientoCreateNestedManyWithoutStockInput = {
    create?: XOR<DetalleMovimientoCreateWithoutStockInput, DetalleMovimientoUncheckedCreateWithoutStockInput> | DetalleMovimientoCreateWithoutStockInput[] | DetalleMovimientoUncheckedCreateWithoutStockInput[]
    connectOrCreate?: DetalleMovimientoCreateOrConnectWithoutStockInput | DetalleMovimientoCreateOrConnectWithoutStockInput[]
    createMany?: DetalleMovimientoCreateManyStockInputEnvelope
    connect?: DetalleMovimientoWhereUniqueInput | DetalleMovimientoWhereUniqueInput[]
  }

  export type DepositoCreateNestedOneWithoutStockInput = {
    create?: XOR<DepositoCreateWithoutStockInput, DepositoUncheckedCreateWithoutStockInput>
    connectOrCreate?: DepositoCreateOrConnectWithoutStockInput
    connect?: DepositoWhereUniqueInput
  }

  export type ProductoCreateNestedOneWithoutStockProductosInput = {
    create?: XOR<ProductoCreateWithoutStockProductosInput, ProductoUncheckedCreateWithoutStockProductosInput>
    connectOrCreate?: ProductoCreateOrConnectWithoutStockProductosInput
    connect?: ProductoWhereUniqueInput
  }

  export type DetalleMovimientoUncheckedCreateNestedManyWithoutStockInput = {
    create?: XOR<DetalleMovimientoCreateWithoutStockInput, DetalleMovimientoUncheckedCreateWithoutStockInput> | DetalleMovimientoCreateWithoutStockInput[] | DetalleMovimientoUncheckedCreateWithoutStockInput[]
    connectOrCreate?: DetalleMovimientoCreateOrConnectWithoutStockInput | DetalleMovimientoCreateOrConnectWithoutStockInput[]
    createMany?: DetalleMovimientoCreateManyStockInputEnvelope
    connect?: DetalleMovimientoWhereUniqueInput | DetalleMovimientoWhereUniqueInput[]
  }

  export type DetalleMovimientoUpdateManyWithoutStockNestedInput = {
    create?: XOR<DetalleMovimientoCreateWithoutStockInput, DetalleMovimientoUncheckedCreateWithoutStockInput> | DetalleMovimientoCreateWithoutStockInput[] | DetalleMovimientoUncheckedCreateWithoutStockInput[]
    connectOrCreate?: DetalleMovimientoCreateOrConnectWithoutStockInput | DetalleMovimientoCreateOrConnectWithoutStockInput[]
    upsert?: DetalleMovimientoUpsertWithWhereUniqueWithoutStockInput | DetalleMovimientoUpsertWithWhereUniqueWithoutStockInput[]
    createMany?: DetalleMovimientoCreateManyStockInputEnvelope
    set?: DetalleMovimientoWhereUniqueInput | DetalleMovimientoWhereUniqueInput[]
    disconnect?: DetalleMovimientoWhereUniqueInput | DetalleMovimientoWhereUniqueInput[]
    delete?: DetalleMovimientoWhereUniqueInput | DetalleMovimientoWhereUniqueInput[]
    connect?: DetalleMovimientoWhereUniqueInput | DetalleMovimientoWhereUniqueInput[]
    update?: DetalleMovimientoUpdateWithWhereUniqueWithoutStockInput | DetalleMovimientoUpdateWithWhereUniqueWithoutStockInput[]
    updateMany?: DetalleMovimientoUpdateManyWithWhereWithoutStockInput | DetalleMovimientoUpdateManyWithWhereWithoutStockInput[]
    deleteMany?: DetalleMovimientoScalarWhereInput | DetalleMovimientoScalarWhereInput[]
  }

  export type DepositoUpdateOneRequiredWithoutStockNestedInput = {
    create?: XOR<DepositoCreateWithoutStockInput, DepositoUncheckedCreateWithoutStockInput>
    connectOrCreate?: DepositoCreateOrConnectWithoutStockInput
    upsert?: DepositoUpsertWithoutStockInput
    connect?: DepositoWhereUniqueInput
    update?: XOR<XOR<DepositoUpdateToOneWithWhereWithoutStockInput, DepositoUpdateWithoutStockInput>, DepositoUncheckedUpdateWithoutStockInput>
  }

  export type ProductoUpdateOneRequiredWithoutStockProductosNestedInput = {
    create?: XOR<ProductoCreateWithoutStockProductosInput, ProductoUncheckedCreateWithoutStockProductosInput>
    connectOrCreate?: ProductoCreateOrConnectWithoutStockProductosInput
    upsert?: ProductoUpsertWithoutStockProductosInput
    connect?: ProductoWhereUniqueInput
    update?: XOR<XOR<ProductoUpdateToOneWithWhereWithoutStockProductosInput, ProductoUpdateWithoutStockProductosInput>, ProductoUncheckedUpdateWithoutStockProductosInput>
  }

  export type DetalleMovimientoUncheckedUpdateManyWithoutStockNestedInput = {
    create?: XOR<DetalleMovimientoCreateWithoutStockInput, DetalleMovimientoUncheckedCreateWithoutStockInput> | DetalleMovimientoCreateWithoutStockInput[] | DetalleMovimientoUncheckedCreateWithoutStockInput[]
    connectOrCreate?: DetalleMovimientoCreateOrConnectWithoutStockInput | DetalleMovimientoCreateOrConnectWithoutStockInput[]
    upsert?: DetalleMovimientoUpsertWithWhereUniqueWithoutStockInput | DetalleMovimientoUpsertWithWhereUniqueWithoutStockInput[]
    createMany?: DetalleMovimientoCreateManyStockInputEnvelope
    set?: DetalleMovimientoWhereUniqueInput | DetalleMovimientoWhereUniqueInput[]
    disconnect?: DetalleMovimientoWhereUniqueInput | DetalleMovimientoWhereUniqueInput[]
    delete?: DetalleMovimientoWhereUniqueInput | DetalleMovimientoWhereUniqueInput[]
    connect?: DetalleMovimientoWhereUniqueInput | DetalleMovimientoWhereUniqueInput[]
    update?: DetalleMovimientoUpdateWithWhereUniqueWithoutStockInput | DetalleMovimientoUpdateWithWhereUniqueWithoutStockInput[]
    updateMany?: DetalleMovimientoUpdateManyWithWhereWithoutStockInput | DetalleMovimientoUpdateManyWithWhereWithoutStockInput[]
    deleteMany?: DetalleMovimientoScalarWhereInput | DetalleMovimientoScalarWhereInput[]
  }

  export type DetalleMovimientoCreateNestedManyWithoutMovimientoInput = {
    create?: XOR<DetalleMovimientoCreateWithoutMovimientoInput, DetalleMovimientoUncheckedCreateWithoutMovimientoInput> | DetalleMovimientoCreateWithoutMovimientoInput[] | DetalleMovimientoUncheckedCreateWithoutMovimientoInput[]
    connectOrCreate?: DetalleMovimientoCreateOrConnectWithoutMovimientoInput | DetalleMovimientoCreateOrConnectWithoutMovimientoInput[]
    createMany?: DetalleMovimientoCreateManyMovimientoInputEnvelope
    connect?: DetalleMovimientoWhereUniqueInput | DetalleMovimientoWhereUniqueInput[]
  }

  export type DepositoCreateNestedOneWithoutMovimientosInput = {
    create?: XOR<DepositoCreateWithoutMovimientosInput, DepositoUncheckedCreateWithoutMovimientosInput>
    connectOrCreate?: DepositoCreateOrConnectWithoutMovimientosInput
    connect?: DepositoWhereUniqueInput
  }

  export type TipoComprobanteCreateNestedOneWithoutMovimientosInput = {
    create?: XOR<TipoComprobanteCreateWithoutMovimientosInput, TipoComprobanteUncheckedCreateWithoutMovimientosInput>
    connectOrCreate?: TipoComprobanteCreateOrConnectWithoutMovimientosInput
    connect?: TipoComprobanteWhereUniqueInput
  }

  export type TipoMovimientoCreateNestedOneWithoutMovimientosInput = {
    create?: XOR<TipoMovimientoCreateWithoutMovimientosInput, TipoMovimientoUncheckedCreateWithoutMovimientosInput>
    connectOrCreate?: TipoMovimientoCreateOrConnectWithoutMovimientosInput
    connect?: TipoMovimientoWhereUniqueInput
  }

  export type DetalleMovimientoUncheckedCreateNestedManyWithoutMovimientoInput = {
    create?: XOR<DetalleMovimientoCreateWithoutMovimientoInput, DetalleMovimientoUncheckedCreateWithoutMovimientoInput> | DetalleMovimientoCreateWithoutMovimientoInput[] | DetalleMovimientoUncheckedCreateWithoutMovimientoInput[]
    connectOrCreate?: DetalleMovimientoCreateOrConnectWithoutMovimientoInput | DetalleMovimientoCreateOrConnectWithoutMovimientoInput[]
    createMany?: DetalleMovimientoCreateManyMovimientoInputEnvelope
    connect?: DetalleMovimientoWhereUniqueInput | DetalleMovimientoWhereUniqueInput[]
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type DetalleMovimientoUpdateManyWithoutMovimientoNestedInput = {
    create?: XOR<DetalleMovimientoCreateWithoutMovimientoInput, DetalleMovimientoUncheckedCreateWithoutMovimientoInput> | DetalleMovimientoCreateWithoutMovimientoInput[] | DetalleMovimientoUncheckedCreateWithoutMovimientoInput[]
    connectOrCreate?: DetalleMovimientoCreateOrConnectWithoutMovimientoInput | DetalleMovimientoCreateOrConnectWithoutMovimientoInput[]
    upsert?: DetalleMovimientoUpsertWithWhereUniqueWithoutMovimientoInput | DetalleMovimientoUpsertWithWhereUniqueWithoutMovimientoInput[]
    createMany?: DetalleMovimientoCreateManyMovimientoInputEnvelope
    set?: DetalleMovimientoWhereUniqueInput | DetalleMovimientoWhereUniqueInput[]
    disconnect?: DetalleMovimientoWhereUniqueInput | DetalleMovimientoWhereUniqueInput[]
    delete?: DetalleMovimientoWhereUniqueInput | DetalleMovimientoWhereUniqueInput[]
    connect?: DetalleMovimientoWhereUniqueInput | DetalleMovimientoWhereUniqueInput[]
    update?: DetalleMovimientoUpdateWithWhereUniqueWithoutMovimientoInput | DetalleMovimientoUpdateWithWhereUniqueWithoutMovimientoInput[]
    updateMany?: DetalleMovimientoUpdateManyWithWhereWithoutMovimientoInput | DetalleMovimientoUpdateManyWithWhereWithoutMovimientoInput[]
    deleteMany?: DetalleMovimientoScalarWhereInput | DetalleMovimientoScalarWhereInput[]
  }

  export type DepositoUpdateOneRequiredWithoutMovimientosNestedInput = {
    create?: XOR<DepositoCreateWithoutMovimientosInput, DepositoUncheckedCreateWithoutMovimientosInput>
    connectOrCreate?: DepositoCreateOrConnectWithoutMovimientosInput
    upsert?: DepositoUpsertWithoutMovimientosInput
    connect?: DepositoWhereUniqueInput
    update?: XOR<XOR<DepositoUpdateToOneWithWhereWithoutMovimientosInput, DepositoUpdateWithoutMovimientosInput>, DepositoUncheckedUpdateWithoutMovimientosInput>
  }

  export type TipoComprobanteUpdateOneRequiredWithoutMovimientosNestedInput = {
    create?: XOR<TipoComprobanteCreateWithoutMovimientosInput, TipoComprobanteUncheckedCreateWithoutMovimientosInput>
    connectOrCreate?: TipoComprobanteCreateOrConnectWithoutMovimientosInput
    upsert?: TipoComprobanteUpsertWithoutMovimientosInput
    connect?: TipoComprobanteWhereUniqueInput
    update?: XOR<XOR<TipoComprobanteUpdateToOneWithWhereWithoutMovimientosInput, TipoComprobanteUpdateWithoutMovimientosInput>, TipoComprobanteUncheckedUpdateWithoutMovimientosInput>
  }

  export type TipoMovimientoUpdateOneRequiredWithoutMovimientosNestedInput = {
    create?: XOR<TipoMovimientoCreateWithoutMovimientosInput, TipoMovimientoUncheckedCreateWithoutMovimientosInput>
    connectOrCreate?: TipoMovimientoCreateOrConnectWithoutMovimientosInput
    upsert?: TipoMovimientoUpsertWithoutMovimientosInput
    connect?: TipoMovimientoWhereUniqueInput
    update?: XOR<XOR<TipoMovimientoUpdateToOneWithWhereWithoutMovimientosInput, TipoMovimientoUpdateWithoutMovimientosInput>, TipoMovimientoUncheckedUpdateWithoutMovimientosInput>
  }

  export type DetalleMovimientoUncheckedUpdateManyWithoutMovimientoNestedInput = {
    create?: XOR<DetalleMovimientoCreateWithoutMovimientoInput, DetalleMovimientoUncheckedCreateWithoutMovimientoInput> | DetalleMovimientoCreateWithoutMovimientoInput[] | DetalleMovimientoUncheckedCreateWithoutMovimientoInput[]
    connectOrCreate?: DetalleMovimientoCreateOrConnectWithoutMovimientoInput | DetalleMovimientoCreateOrConnectWithoutMovimientoInput[]
    upsert?: DetalleMovimientoUpsertWithWhereUniqueWithoutMovimientoInput | DetalleMovimientoUpsertWithWhereUniqueWithoutMovimientoInput[]
    createMany?: DetalleMovimientoCreateManyMovimientoInputEnvelope
    set?: DetalleMovimientoWhereUniqueInput | DetalleMovimientoWhereUniqueInput[]
    disconnect?: DetalleMovimientoWhereUniqueInput | DetalleMovimientoWhereUniqueInput[]
    delete?: DetalleMovimientoWhereUniqueInput | DetalleMovimientoWhereUniqueInput[]
    connect?: DetalleMovimientoWhereUniqueInput | DetalleMovimientoWhereUniqueInput[]
    update?: DetalleMovimientoUpdateWithWhereUniqueWithoutMovimientoInput | DetalleMovimientoUpdateWithWhereUniqueWithoutMovimientoInput[]
    updateMany?: DetalleMovimientoUpdateManyWithWhereWithoutMovimientoInput | DetalleMovimientoUpdateManyWithWhereWithoutMovimientoInput[]
    deleteMany?: DetalleMovimientoScalarWhereInput | DetalleMovimientoScalarWhereInput[]
  }

  export type MovimientoStockCreateNestedOneWithoutDetallesInput = {
    create?: XOR<MovimientoStockCreateWithoutDetallesInput, MovimientoStockUncheckedCreateWithoutDetallesInput>
    connectOrCreate?: MovimientoStockCreateOrConnectWithoutDetallesInput
    connect?: MovimientoStockWhereUniqueInput
  }

  export type StockPorDepositoCreateNestedOneWithoutDetallesMovimientoInput = {
    create?: XOR<StockPorDepositoCreateWithoutDetallesMovimientoInput, StockPorDepositoUncheckedCreateWithoutDetallesMovimientoInput>
    connectOrCreate?: StockPorDepositoCreateOrConnectWithoutDetallesMovimientoInput
    connect?: StockPorDepositoWhereUniqueInput
  }

  export type MovimientoStockUpdateOneRequiredWithoutDetallesNestedInput = {
    create?: XOR<MovimientoStockCreateWithoutDetallesInput, MovimientoStockUncheckedCreateWithoutDetallesInput>
    connectOrCreate?: MovimientoStockCreateOrConnectWithoutDetallesInput
    upsert?: MovimientoStockUpsertWithoutDetallesInput
    connect?: MovimientoStockWhereUniqueInput
    update?: XOR<XOR<MovimientoStockUpdateToOneWithWhereWithoutDetallesInput, MovimientoStockUpdateWithoutDetallesInput>, MovimientoStockUncheckedUpdateWithoutDetallesInput>
  }

  export type StockPorDepositoUpdateOneRequiredWithoutDetallesMovimientoNestedInput = {
    create?: XOR<StockPorDepositoCreateWithoutDetallesMovimientoInput, StockPorDepositoUncheckedCreateWithoutDetallesMovimientoInput>
    connectOrCreate?: StockPorDepositoCreateOrConnectWithoutDetallesMovimientoInput
    upsert?: StockPorDepositoUpsertWithoutDetallesMovimientoInput
    connect?: StockPorDepositoWhereUniqueInput
    update?: XOR<XOR<StockPorDepositoUpdateToOneWithWhereWithoutDetallesMovimientoInput, StockPorDepositoUpdateWithoutDetallesMovimientoInput>, StockPorDepositoUncheckedUpdateWithoutDetallesMovimientoInput>
  }

  export type MovimientoStockCreateNestedManyWithoutTipoComprobanteInput = {
    create?: XOR<MovimientoStockCreateWithoutTipoComprobanteInput, MovimientoStockUncheckedCreateWithoutTipoComprobanteInput> | MovimientoStockCreateWithoutTipoComprobanteInput[] | MovimientoStockUncheckedCreateWithoutTipoComprobanteInput[]
    connectOrCreate?: MovimientoStockCreateOrConnectWithoutTipoComprobanteInput | MovimientoStockCreateOrConnectWithoutTipoComprobanteInput[]
    createMany?: MovimientoStockCreateManyTipoComprobanteInputEnvelope
    connect?: MovimientoStockWhereUniqueInput | MovimientoStockWhereUniqueInput[]
  }

  export type MovimientoStockUncheckedCreateNestedManyWithoutTipoComprobanteInput = {
    create?: XOR<MovimientoStockCreateWithoutTipoComprobanteInput, MovimientoStockUncheckedCreateWithoutTipoComprobanteInput> | MovimientoStockCreateWithoutTipoComprobanteInput[] | MovimientoStockUncheckedCreateWithoutTipoComprobanteInput[]
    connectOrCreate?: MovimientoStockCreateOrConnectWithoutTipoComprobanteInput | MovimientoStockCreateOrConnectWithoutTipoComprobanteInput[]
    createMany?: MovimientoStockCreateManyTipoComprobanteInputEnvelope
    connect?: MovimientoStockWhereUniqueInput | MovimientoStockWhereUniqueInput[]
  }

  export type MovimientoStockUpdateManyWithoutTipoComprobanteNestedInput = {
    create?: XOR<MovimientoStockCreateWithoutTipoComprobanteInput, MovimientoStockUncheckedCreateWithoutTipoComprobanteInput> | MovimientoStockCreateWithoutTipoComprobanteInput[] | MovimientoStockUncheckedCreateWithoutTipoComprobanteInput[]
    connectOrCreate?: MovimientoStockCreateOrConnectWithoutTipoComprobanteInput | MovimientoStockCreateOrConnectWithoutTipoComprobanteInput[]
    upsert?: MovimientoStockUpsertWithWhereUniqueWithoutTipoComprobanteInput | MovimientoStockUpsertWithWhereUniqueWithoutTipoComprobanteInput[]
    createMany?: MovimientoStockCreateManyTipoComprobanteInputEnvelope
    set?: MovimientoStockWhereUniqueInput | MovimientoStockWhereUniqueInput[]
    disconnect?: MovimientoStockWhereUniqueInput | MovimientoStockWhereUniqueInput[]
    delete?: MovimientoStockWhereUniqueInput | MovimientoStockWhereUniqueInput[]
    connect?: MovimientoStockWhereUniqueInput | MovimientoStockWhereUniqueInput[]
    update?: MovimientoStockUpdateWithWhereUniqueWithoutTipoComprobanteInput | MovimientoStockUpdateWithWhereUniqueWithoutTipoComprobanteInput[]
    updateMany?: MovimientoStockUpdateManyWithWhereWithoutTipoComprobanteInput | MovimientoStockUpdateManyWithWhereWithoutTipoComprobanteInput[]
    deleteMany?: MovimientoStockScalarWhereInput | MovimientoStockScalarWhereInput[]
  }

  export type MovimientoStockUncheckedUpdateManyWithoutTipoComprobanteNestedInput = {
    create?: XOR<MovimientoStockCreateWithoutTipoComprobanteInput, MovimientoStockUncheckedCreateWithoutTipoComprobanteInput> | MovimientoStockCreateWithoutTipoComprobanteInput[] | MovimientoStockUncheckedCreateWithoutTipoComprobanteInput[]
    connectOrCreate?: MovimientoStockCreateOrConnectWithoutTipoComprobanteInput | MovimientoStockCreateOrConnectWithoutTipoComprobanteInput[]
    upsert?: MovimientoStockUpsertWithWhereUniqueWithoutTipoComprobanteInput | MovimientoStockUpsertWithWhereUniqueWithoutTipoComprobanteInput[]
    createMany?: MovimientoStockCreateManyTipoComprobanteInputEnvelope
    set?: MovimientoStockWhereUniqueInput | MovimientoStockWhereUniqueInput[]
    disconnect?: MovimientoStockWhereUniqueInput | MovimientoStockWhereUniqueInput[]
    delete?: MovimientoStockWhereUniqueInput | MovimientoStockWhereUniqueInput[]
    connect?: MovimientoStockWhereUniqueInput | MovimientoStockWhereUniqueInput[]
    update?: MovimientoStockUpdateWithWhereUniqueWithoutTipoComprobanteInput | MovimientoStockUpdateWithWhereUniqueWithoutTipoComprobanteInput[]
    updateMany?: MovimientoStockUpdateManyWithWhereWithoutTipoComprobanteInput | MovimientoStockUpdateManyWithWhereWithoutTipoComprobanteInput[]
    deleteMany?: MovimientoStockScalarWhereInput | MovimientoStockScalarWhereInput[]
  }

  export type MovimientoStockCreateNestedManyWithoutTipoMovimientoInput = {
    create?: XOR<MovimientoStockCreateWithoutTipoMovimientoInput, MovimientoStockUncheckedCreateWithoutTipoMovimientoInput> | MovimientoStockCreateWithoutTipoMovimientoInput[] | MovimientoStockUncheckedCreateWithoutTipoMovimientoInput[]
    connectOrCreate?: MovimientoStockCreateOrConnectWithoutTipoMovimientoInput | MovimientoStockCreateOrConnectWithoutTipoMovimientoInput[]
    createMany?: MovimientoStockCreateManyTipoMovimientoInputEnvelope
    connect?: MovimientoStockWhereUniqueInput | MovimientoStockWhereUniqueInput[]
  }

  export type MovimientoStockUncheckedCreateNestedManyWithoutTipoMovimientoInput = {
    create?: XOR<MovimientoStockCreateWithoutTipoMovimientoInput, MovimientoStockUncheckedCreateWithoutTipoMovimientoInput> | MovimientoStockCreateWithoutTipoMovimientoInput[] | MovimientoStockUncheckedCreateWithoutTipoMovimientoInput[]
    connectOrCreate?: MovimientoStockCreateOrConnectWithoutTipoMovimientoInput | MovimientoStockCreateOrConnectWithoutTipoMovimientoInput[]
    createMany?: MovimientoStockCreateManyTipoMovimientoInputEnvelope
    connect?: MovimientoStockWhereUniqueInput | MovimientoStockWhereUniqueInput[]
  }

  export type MovimientoStockUpdateManyWithoutTipoMovimientoNestedInput = {
    create?: XOR<MovimientoStockCreateWithoutTipoMovimientoInput, MovimientoStockUncheckedCreateWithoutTipoMovimientoInput> | MovimientoStockCreateWithoutTipoMovimientoInput[] | MovimientoStockUncheckedCreateWithoutTipoMovimientoInput[]
    connectOrCreate?: MovimientoStockCreateOrConnectWithoutTipoMovimientoInput | MovimientoStockCreateOrConnectWithoutTipoMovimientoInput[]
    upsert?: MovimientoStockUpsertWithWhereUniqueWithoutTipoMovimientoInput | MovimientoStockUpsertWithWhereUniqueWithoutTipoMovimientoInput[]
    createMany?: MovimientoStockCreateManyTipoMovimientoInputEnvelope
    set?: MovimientoStockWhereUniqueInput | MovimientoStockWhereUniqueInput[]
    disconnect?: MovimientoStockWhereUniqueInput | MovimientoStockWhereUniqueInput[]
    delete?: MovimientoStockWhereUniqueInput | MovimientoStockWhereUniqueInput[]
    connect?: MovimientoStockWhereUniqueInput | MovimientoStockWhereUniqueInput[]
    update?: MovimientoStockUpdateWithWhereUniqueWithoutTipoMovimientoInput | MovimientoStockUpdateWithWhereUniqueWithoutTipoMovimientoInput[]
    updateMany?: MovimientoStockUpdateManyWithWhereWithoutTipoMovimientoInput | MovimientoStockUpdateManyWithWhereWithoutTipoMovimientoInput[]
    deleteMany?: MovimientoStockScalarWhereInput | MovimientoStockScalarWhereInput[]
  }

  export type MovimientoStockUncheckedUpdateManyWithoutTipoMovimientoNestedInput = {
    create?: XOR<MovimientoStockCreateWithoutTipoMovimientoInput, MovimientoStockUncheckedCreateWithoutTipoMovimientoInput> | MovimientoStockCreateWithoutTipoMovimientoInput[] | MovimientoStockUncheckedCreateWithoutTipoMovimientoInput[]
    connectOrCreate?: MovimientoStockCreateOrConnectWithoutTipoMovimientoInput | MovimientoStockCreateOrConnectWithoutTipoMovimientoInput[]
    upsert?: MovimientoStockUpsertWithWhereUniqueWithoutTipoMovimientoInput | MovimientoStockUpsertWithWhereUniqueWithoutTipoMovimientoInput[]
    createMany?: MovimientoStockCreateManyTipoMovimientoInputEnvelope
    set?: MovimientoStockWhereUniqueInput | MovimientoStockWhereUniqueInput[]
    disconnect?: MovimientoStockWhereUniqueInput | MovimientoStockWhereUniqueInput[]
    delete?: MovimientoStockWhereUniqueInput | MovimientoStockWhereUniqueInput[]
    connect?: MovimientoStockWhereUniqueInput | MovimientoStockWhereUniqueInput[]
    update?: MovimientoStockUpdateWithWhereUniqueWithoutTipoMovimientoInput | MovimientoStockUpdateWithWhereUniqueWithoutTipoMovimientoInput[]
    updateMany?: MovimientoStockUpdateManyWithWhereWithoutTipoMovimientoInput | MovimientoStockUpdateManyWithWhereWithoutTipoMovimientoInput[]
    deleteMany?: MovimientoStockScalarWhereInput | MovimientoStockScalarWhereInput[]
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type ProductoCreateWithoutRubroInput = {
    nombre: string
    descripcion?: string | null
    precioCompra: number
    precioVenta: number
    estado?: boolean
    marca: MarcaCreateNestedOneWithoutProductosInput
    unidad: UnidadCreateNestedOneWithoutProductosInput
    stockProductos?: StockPorDepositoCreateNestedManyWithoutProductoInput
  }

  export type ProductoUncheckedCreateWithoutRubroInput = {
    id?: number
    nombre: string
    descripcion?: string | null
    marcaId: number
    unidadId: number
    precioCompra: number
    precioVenta: number
    estado?: boolean
    stockProductos?: StockPorDepositoUncheckedCreateNestedManyWithoutProductoInput
  }

  export type ProductoCreateOrConnectWithoutRubroInput = {
    where: ProductoWhereUniqueInput
    create: XOR<ProductoCreateWithoutRubroInput, ProductoUncheckedCreateWithoutRubroInput>
  }

  export type ProductoCreateManyRubroInputEnvelope = {
    data: ProductoCreateManyRubroInput | ProductoCreateManyRubroInput[]
    skipDuplicates?: boolean
  }

  export type ProductoUpsertWithWhereUniqueWithoutRubroInput = {
    where: ProductoWhereUniqueInput
    update: XOR<ProductoUpdateWithoutRubroInput, ProductoUncheckedUpdateWithoutRubroInput>
    create: XOR<ProductoCreateWithoutRubroInput, ProductoUncheckedCreateWithoutRubroInput>
  }

  export type ProductoUpdateWithWhereUniqueWithoutRubroInput = {
    where: ProductoWhereUniqueInput
    data: XOR<ProductoUpdateWithoutRubroInput, ProductoUncheckedUpdateWithoutRubroInput>
  }

  export type ProductoUpdateManyWithWhereWithoutRubroInput = {
    where: ProductoScalarWhereInput
    data: XOR<ProductoUpdateManyMutationInput, ProductoUncheckedUpdateManyWithoutRubroInput>
  }

  export type ProductoScalarWhereInput = {
    AND?: ProductoScalarWhereInput | ProductoScalarWhereInput[]
    OR?: ProductoScalarWhereInput[]
    NOT?: ProductoScalarWhereInput | ProductoScalarWhereInput[]
    id?: IntFilter<"Producto"> | number
    nombre?: StringFilter<"Producto"> | string
    descripcion?: StringNullableFilter<"Producto"> | string | null
    rubroId?: IntFilter<"Producto"> | number
    marcaId?: IntFilter<"Producto"> | number
    unidadId?: IntFilter<"Producto"> | number
    precioCompra?: FloatFilter<"Producto"> | number
    precioVenta?: FloatFilter<"Producto"> | number
    estado?: BoolFilter<"Producto"> | boolean
  }

  export type ProductoCreateWithoutUnidadInput = {
    nombre: string
    descripcion?: string | null
    precioCompra: number
    precioVenta: number
    estado?: boolean
    marca: MarcaCreateNestedOneWithoutProductosInput
    rubro: RubroCreateNestedOneWithoutProductosInput
    stockProductos?: StockPorDepositoCreateNestedManyWithoutProductoInput
  }

  export type ProductoUncheckedCreateWithoutUnidadInput = {
    id?: number
    nombre: string
    descripcion?: string | null
    rubroId: number
    marcaId: number
    precioCompra: number
    precioVenta: number
    estado?: boolean
    stockProductos?: StockPorDepositoUncheckedCreateNestedManyWithoutProductoInput
  }

  export type ProductoCreateOrConnectWithoutUnidadInput = {
    where: ProductoWhereUniqueInput
    create: XOR<ProductoCreateWithoutUnidadInput, ProductoUncheckedCreateWithoutUnidadInput>
  }

  export type ProductoCreateManyUnidadInputEnvelope = {
    data: ProductoCreateManyUnidadInput | ProductoCreateManyUnidadInput[]
    skipDuplicates?: boolean
  }

  export type ProductoUpsertWithWhereUniqueWithoutUnidadInput = {
    where: ProductoWhereUniqueInput
    update: XOR<ProductoUpdateWithoutUnidadInput, ProductoUncheckedUpdateWithoutUnidadInput>
    create: XOR<ProductoCreateWithoutUnidadInput, ProductoUncheckedCreateWithoutUnidadInput>
  }

  export type ProductoUpdateWithWhereUniqueWithoutUnidadInput = {
    where: ProductoWhereUniqueInput
    data: XOR<ProductoUpdateWithoutUnidadInput, ProductoUncheckedUpdateWithoutUnidadInput>
  }

  export type ProductoUpdateManyWithWhereWithoutUnidadInput = {
    where: ProductoScalarWhereInput
    data: XOR<ProductoUpdateManyMutationInput, ProductoUncheckedUpdateManyWithoutUnidadInput>
  }

  export type ProductoCreateWithoutMarcaInput = {
    nombre: string
    descripcion?: string | null
    precioCompra: number
    precioVenta: number
    estado?: boolean
    rubro: RubroCreateNestedOneWithoutProductosInput
    unidad: UnidadCreateNestedOneWithoutProductosInput
    stockProductos?: StockPorDepositoCreateNestedManyWithoutProductoInput
  }

  export type ProductoUncheckedCreateWithoutMarcaInput = {
    id?: number
    nombre: string
    descripcion?: string | null
    rubroId: number
    unidadId: number
    precioCompra: number
    precioVenta: number
    estado?: boolean
    stockProductos?: StockPorDepositoUncheckedCreateNestedManyWithoutProductoInput
  }

  export type ProductoCreateOrConnectWithoutMarcaInput = {
    where: ProductoWhereUniqueInput
    create: XOR<ProductoCreateWithoutMarcaInput, ProductoUncheckedCreateWithoutMarcaInput>
  }

  export type ProductoCreateManyMarcaInputEnvelope = {
    data: ProductoCreateManyMarcaInput | ProductoCreateManyMarcaInput[]
    skipDuplicates?: boolean
  }

  export type ProductoUpsertWithWhereUniqueWithoutMarcaInput = {
    where: ProductoWhereUniqueInput
    update: XOR<ProductoUpdateWithoutMarcaInput, ProductoUncheckedUpdateWithoutMarcaInput>
    create: XOR<ProductoCreateWithoutMarcaInput, ProductoUncheckedCreateWithoutMarcaInput>
  }

  export type ProductoUpdateWithWhereUniqueWithoutMarcaInput = {
    where: ProductoWhereUniqueInput
    data: XOR<ProductoUpdateWithoutMarcaInput, ProductoUncheckedUpdateWithoutMarcaInput>
  }

  export type ProductoUpdateManyWithWhereWithoutMarcaInput = {
    where: ProductoScalarWhereInput
    data: XOR<ProductoUpdateManyMutationInput, ProductoUncheckedUpdateManyWithoutMarcaInput>
  }

  export type MarcaCreateWithoutProductosInput = {
    nombre: string
  }

  export type MarcaUncheckedCreateWithoutProductosInput = {
    id?: number
    nombre: string
  }

  export type MarcaCreateOrConnectWithoutProductosInput = {
    where: MarcaWhereUniqueInput
    create: XOR<MarcaCreateWithoutProductosInput, MarcaUncheckedCreateWithoutProductosInput>
  }

  export type RubroCreateWithoutProductosInput = {
    nombre: string
  }

  export type RubroUncheckedCreateWithoutProductosInput = {
    id?: number
    nombre: string
  }

  export type RubroCreateOrConnectWithoutProductosInput = {
    where: RubroWhereUniqueInput
    create: XOR<RubroCreateWithoutProductosInput, RubroUncheckedCreateWithoutProductosInput>
  }

  export type UnidadCreateWithoutProductosInput = {
    nombre: string
  }

  export type UnidadUncheckedCreateWithoutProductosInput = {
    id?: number
    nombre: string
  }

  export type UnidadCreateOrConnectWithoutProductosInput = {
    where: UnidadWhereUniqueInput
    create: XOR<UnidadCreateWithoutProductosInput, UnidadUncheckedCreateWithoutProductosInput>
  }

  export type StockPorDepositoCreateWithoutProductoInput = {
    stockActual?: number
    stockMinimo?: number
    stockMaximo?: number | null
    capacidadMaxima?: number | null
    detallesMovimiento?: DetalleMovimientoCreateNestedManyWithoutStockInput
    deposito: DepositoCreateNestedOneWithoutStockInput
  }

  export type StockPorDepositoUncheckedCreateWithoutProductoInput = {
    id?: number
    depositoId: number
    stockActual?: number
    stockMinimo?: number
    stockMaximo?: number | null
    capacidadMaxima?: number | null
    detallesMovimiento?: DetalleMovimientoUncheckedCreateNestedManyWithoutStockInput
  }

  export type StockPorDepositoCreateOrConnectWithoutProductoInput = {
    where: StockPorDepositoWhereUniqueInput
    create: XOR<StockPorDepositoCreateWithoutProductoInput, StockPorDepositoUncheckedCreateWithoutProductoInput>
  }

  export type StockPorDepositoCreateManyProductoInputEnvelope = {
    data: StockPorDepositoCreateManyProductoInput | StockPorDepositoCreateManyProductoInput[]
    skipDuplicates?: boolean
  }

  export type MarcaUpsertWithoutProductosInput = {
    update: XOR<MarcaUpdateWithoutProductosInput, MarcaUncheckedUpdateWithoutProductosInput>
    create: XOR<MarcaCreateWithoutProductosInput, MarcaUncheckedCreateWithoutProductosInput>
    where?: MarcaWhereInput
  }

  export type MarcaUpdateToOneWithWhereWithoutProductosInput = {
    where?: MarcaWhereInput
    data: XOR<MarcaUpdateWithoutProductosInput, MarcaUncheckedUpdateWithoutProductosInput>
  }

  export type MarcaUpdateWithoutProductosInput = {
    nombre?: StringFieldUpdateOperationsInput | string
  }

  export type MarcaUncheckedUpdateWithoutProductosInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
  }

  export type RubroUpsertWithoutProductosInput = {
    update: XOR<RubroUpdateWithoutProductosInput, RubroUncheckedUpdateWithoutProductosInput>
    create: XOR<RubroCreateWithoutProductosInput, RubroUncheckedCreateWithoutProductosInput>
    where?: RubroWhereInput
  }

  export type RubroUpdateToOneWithWhereWithoutProductosInput = {
    where?: RubroWhereInput
    data: XOR<RubroUpdateWithoutProductosInput, RubroUncheckedUpdateWithoutProductosInput>
  }

  export type RubroUpdateWithoutProductosInput = {
    nombre?: StringFieldUpdateOperationsInput | string
  }

  export type RubroUncheckedUpdateWithoutProductosInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
  }

  export type UnidadUpsertWithoutProductosInput = {
    update: XOR<UnidadUpdateWithoutProductosInput, UnidadUncheckedUpdateWithoutProductosInput>
    create: XOR<UnidadCreateWithoutProductosInput, UnidadUncheckedCreateWithoutProductosInput>
    where?: UnidadWhereInput
  }

  export type UnidadUpdateToOneWithWhereWithoutProductosInput = {
    where?: UnidadWhereInput
    data: XOR<UnidadUpdateWithoutProductosInput, UnidadUncheckedUpdateWithoutProductosInput>
  }

  export type UnidadUpdateWithoutProductosInput = {
    nombre?: StringFieldUpdateOperationsInput | string
  }

  export type UnidadUncheckedUpdateWithoutProductosInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
  }

  export type StockPorDepositoUpsertWithWhereUniqueWithoutProductoInput = {
    where: StockPorDepositoWhereUniqueInput
    update: XOR<StockPorDepositoUpdateWithoutProductoInput, StockPorDepositoUncheckedUpdateWithoutProductoInput>
    create: XOR<StockPorDepositoCreateWithoutProductoInput, StockPorDepositoUncheckedCreateWithoutProductoInput>
  }

  export type StockPorDepositoUpdateWithWhereUniqueWithoutProductoInput = {
    where: StockPorDepositoWhereUniqueInput
    data: XOR<StockPorDepositoUpdateWithoutProductoInput, StockPorDepositoUncheckedUpdateWithoutProductoInput>
  }

  export type StockPorDepositoUpdateManyWithWhereWithoutProductoInput = {
    where: StockPorDepositoScalarWhereInput
    data: XOR<StockPorDepositoUpdateManyMutationInput, StockPorDepositoUncheckedUpdateManyWithoutProductoInput>
  }

  export type StockPorDepositoScalarWhereInput = {
    AND?: StockPorDepositoScalarWhereInput | StockPorDepositoScalarWhereInput[]
    OR?: StockPorDepositoScalarWhereInput[]
    NOT?: StockPorDepositoScalarWhereInput | StockPorDepositoScalarWhereInput[]
    id?: IntFilter<"StockPorDeposito"> | number
    productoId?: IntFilter<"StockPorDeposito"> | number
    depositoId?: IntFilter<"StockPorDeposito"> | number
    stockActual?: IntFilter<"StockPorDeposito"> | number
    stockMinimo?: IntFilter<"StockPorDeposito"> | number
    stockMaximo?: IntNullableFilter<"StockPorDeposito"> | number | null
    capacidadMaxima?: IntNullableFilter<"StockPorDeposito"> | number | null
  }

  export type MovimientoStockCreateWithoutDepositoInput = {
    fecha?: Date | string
    hora?: Date | string
    detalles?: DetalleMovimientoCreateNestedManyWithoutMovimientoInput
    tipoComprobante: TipoComprobanteCreateNestedOneWithoutMovimientosInput
    tipoMovimiento: TipoMovimientoCreateNestedOneWithoutMovimientosInput
  }

  export type MovimientoStockUncheckedCreateWithoutDepositoInput = {
    id?: number
    tipoMovimientoId: number
    tipoComprobanteId: number
    fecha?: Date | string
    hora?: Date | string
    detalles?: DetalleMovimientoUncheckedCreateNestedManyWithoutMovimientoInput
  }

  export type MovimientoStockCreateOrConnectWithoutDepositoInput = {
    where: MovimientoStockWhereUniqueInput
    create: XOR<MovimientoStockCreateWithoutDepositoInput, MovimientoStockUncheckedCreateWithoutDepositoInput>
  }

  export type MovimientoStockCreateManyDepositoInputEnvelope = {
    data: MovimientoStockCreateManyDepositoInput | MovimientoStockCreateManyDepositoInput[]
    skipDuplicates?: boolean
  }

  export type StockPorDepositoCreateWithoutDepositoInput = {
    stockActual?: number
    stockMinimo?: number
    stockMaximo?: number | null
    capacidadMaxima?: number | null
    detallesMovimiento?: DetalleMovimientoCreateNestedManyWithoutStockInput
    producto: ProductoCreateNestedOneWithoutStockProductosInput
  }

  export type StockPorDepositoUncheckedCreateWithoutDepositoInput = {
    id?: number
    productoId: number
    stockActual?: number
    stockMinimo?: number
    stockMaximo?: number | null
    capacidadMaxima?: number | null
    detallesMovimiento?: DetalleMovimientoUncheckedCreateNestedManyWithoutStockInput
  }

  export type StockPorDepositoCreateOrConnectWithoutDepositoInput = {
    where: StockPorDepositoWhereUniqueInput
    create: XOR<StockPorDepositoCreateWithoutDepositoInput, StockPorDepositoUncheckedCreateWithoutDepositoInput>
  }

  export type StockPorDepositoCreateManyDepositoInputEnvelope = {
    data: StockPorDepositoCreateManyDepositoInput | StockPorDepositoCreateManyDepositoInput[]
    skipDuplicates?: boolean
  }

  export type MovimientoStockUpsertWithWhereUniqueWithoutDepositoInput = {
    where: MovimientoStockWhereUniqueInput
    update: XOR<MovimientoStockUpdateWithoutDepositoInput, MovimientoStockUncheckedUpdateWithoutDepositoInput>
    create: XOR<MovimientoStockCreateWithoutDepositoInput, MovimientoStockUncheckedCreateWithoutDepositoInput>
  }

  export type MovimientoStockUpdateWithWhereUniqueWithoutDepositoInput = {
    where: MovimientoStockWhereUniqueInput
    data: XOR<MovimientoStockUpdateWithoutDepositoInput, MovimientoStockUncheckedUpdateWithoutDepositoInput>
  }

  export type MovimientoStockUpdateManyWithWhereWithoutDepositoInput = {
    where: MovimientoStockScalarWhereInput
    data: XOR<MovimientoStockUpdateManyMutationInput, MovimientoStockUncheckedUpdateManyWithoutDepositoInput>
  }

  export type MovimientoStockScalarWhereInput = {
    AND?: MovimientoStockScalarWhereInput | MovimientoStockScalarWhereInput[]
    OR?: MovimientoStockScalarWhereInput[]
    NOT?: MovimientoStockScalarWhereInput | MovimientoStockScalarWhereInput[]
    id?: IntFilter<"MovimientoStock"> | number
    depositoId?: IntFilter<"MovimientoStock"> | number
    tipoMovimientoId?: IntFilter<"MovimientoStock"> | number
    tipoComprobanteId?: IntFilter<"MovimientoStock"> | number
    fecha?: DateTimeFilter<"MovimientoStock"> | Date | string
    hora?: DateTimeFilter<"MovimientoStock"> | Date | string
  }

  export type StockPorDepositoUpsertWithWhereUniqueWithoutDepositoInput = {
    where: StockPorDepositoWhereUniqueInput
    update: XOR<StockPorDepositoUpdateWithoutDepositoInput, StockPorDepositoUncheckedUpdateWithoutDepositoInput>
    create: XOR<StockPorDepositoCreateWithoutDepositoInput, StockPorDepositoUncheckedCreateWithoutDepositoInput>
  }

  export type StockPorDepositoUpdateWithWhereUniqueWithoutDepositoInput = {
    where: StockPorDepositoWhereUniqueInput
    data: XOR<StockPorDepositoUpdateWithoutDepositoInput, StockPorDepositoUncheckedUpdateWithoutDepositoInput>
  }

  export type StockPorDepositoUpdateManyWithWhereWithoutDepositoInput = {
    where: StockPorDepositoScalarWhereInput
    data: XOR<StockPorDepositoUpdateManyMutationInput, StockPorDepositoUncheckedUpdateManyWithoutDepositoInput>
  }

  export type DetalleMovimientoCreateWithoutStockInput = {
    cantidad: number
    movimiento: MovimientoStockCreateNestedOneWithoutDetallesInput
  }

  export type DetalleMovimientoUncheckedCreateWithoutStockInput = {
    id?: number
    movimientoId: number
    cantidad: number
  }

  export type DetalleMovimientoCreateOrConnectWithoutStockInput = {
    where: DetalleMovimientoWhereUniqueInput
    create: XOR<DetalleMovimientoCreateWithoutStockInput, DetalleMovimientoUncheckedCreateWithoutStockInput>
  }

  export type DetalleMovimientoCreateManyStockInputEnvelope = {
    data: DetalleMovimientoCreateManyStockInput | DetalleMovimientoCreateManyStockInput[]
    skipDuplicates?: boolean
  }

  export type DepositoCreateWithoutStockInput = {
    nombre: string
    ubicacion: string
    tipo: string
    capacidad?: number | null
    estado?: boolean
    movimientos?: MovimientoStockCreateNestedManyWithoutDepositoInput
  }

  export type DepositoUncheckedCreateWithoutStockInput = {
    id?: number
    nombre: string
    ubicacion: string
    tipo: string
    capacidad?: number | null
    estado?: boolean
    movimientos?: MovimientoStockUncheckedCreateNestedManyWithoutDepositoInput
  }

  export type DepositoCreateOrConnectWithoutStockInput = {
    where: DepositoWhereUniqueInput
    create: XOR<DepositoCreateWithoutStockInput, DepositoUncheckedCreateWithoutStockInput>
  }

  export type ProductoCreateWithoutStockProductosInput = {
    nombre: string
    descripcion?: string | null
    precioCompra: number
    precioVenta: number
    estado?: boolean
    marca: MarcaCreateNestedOneWithoutProductosInput
    rubro: RubroCreateNestedOneWithoutProductosInput
    unidad: UnidadCreateNestedOneWithoutProductosInput
  }

  export type ProductoUncheckedCreateWithoutStockProductosInput = {
    id?: number
    nombre: string
    descripcion?: string | null
    rubroId: number
    marcaId: number
    unidadId: number
    precioCompra: number
    precioVenta: number
    estado?: boolean
  }

  export type ProductoCreateOrConnectWithoutStockProductosInput = {
    where: ProductoWhereUniqueInput
    create: XOR<ProductoCreateWithoutStockProductosInput, ProductoUncheckedCreateWithoutStockProductosInput>
  }

  export type DetalleMovimientoUpsertWithWhereUniqueWithoutStockInput = {
    where: DetalleMovimientoWhereUniqueInput
    update: XOR<DetalleMovimientoUpdateWithoutStockInput, DetalleMovimientoUncheckedUpdateWithoutStockInput>
    create: XOR<DetalleMovimientoCreateWithoutStockInput, DetalleMovimientoUncheckedCreateWithoutStockInput>
  }

  export type DetalleMovimientoUpdateWithWhereUniqueWithoutStockInput = {
    where: DetalleMovimientoWhereUniqueInput
    data: XOR<DetalleMovimientoUpdateWithoutStockInput, DetalleMovimientoUncheckedUpdateWithoutStockInput>
  }

  export type DetalleMovimientoUpdateManyWithWhereWithoutStockInput = {
    where: DetalleMovimientoScalarWhereInput
    data: XOR<DetalleMovimientoUpdateManyMutationInput, DetalleMovimientoUncheckedUpdateManyWithoutStockInput>
  }

  export type DetalleMovimientoScalarWhereInput = {
    AND?: DetalleMovimientoScalarWhereInput | DetalleMovimientoScalarWhereInput[]
    OR?: DetalleMovimientoScalarWhereInput[]
    NOT?: DetalleMovimientoScalarWhereInput | DetalleMovimientoScalarWhereInput[]
    id?: IntFilter<"DetalleMovimiento"> | number
    movimientoId?: IntFilter<"DetalleMovimiento"> | number
    stockId?: IntFilter<"DetalleMovimiento"> | number
    cantidad?: IntFilter<"DetalleMovimiento"> | number
  }

  export type DepositoUpsertWithoutStockInput = {
    update: XOR<DepositoUpdateWithoutStockInput, DepositoUncheckedUpdateWithoutStockInput>
    create: XOR<DepositoCreateWithoutStockInput, DepositoUncheckedCreateWithoutStockInput>
    where?: DepositoWhereInput
  }

  export type DepositoUpdateToOneWithWhereWithoutStockInput = {
    where?: DepositoWhereInput
    data: XOR<DepositoUpdateWithoutStockInput, DepositoUncheckedUpdateWithoutStockInput>
  }

  export type DepositoUpdateWithoutStockInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    ubicacion?: StringFieldUpdateOperationsInput | string
    tipo?: StringFieldUpdateOperationsInput | string
    capacidad?: NullableIntFieldUpdateOperationsInput | number | null
    estado?: BoolFieldUpdateOperationsInput | boolean
    movimientos?: MovimientoStockUpdateManyWithoutDepositoNestedInput
  }

  export type DepositoUncheckedUpdateWithoutStockInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    ubicacion?: StringFieldUpdateOperationsInput | string
    tipo?: StringFieldUpdateOperationsInput | string
    capacidad?: NullableIntFieldUpdateOperationsInput | number | null
    estado?: BoolFieldUpdateOperationsInput | boolean
    movimientos?: MovimientoStockUncheckedUpdateManyWithoutDepositoNestedInput
  }

  export type ProductoUpsertWithoutStockProductosInput = {
    update: XOR<ProductoUpdateWithoutStockProductosInput, ProductoUncheckedUpdateWithoutStockProductosInput>
    create: XOR<ProductoCreateWithoutStockProductosInput, ProductoUncheckedCreateWithoutStockProductosInput>
    where?: ProductoWhereInput
  }

  export type ProductoUpdateToOneWithWhereWithoutStockProductosInput = {
    where?: ProductoWhereInput
    data: XOR<ProductoUpdateWithoutStockProductosInput, ProductoUncheckedUpdateWithoutStockProductosInput>
  }

  export type ProductoUpdateWithoutStockProductosInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null
    precioCompra?: FloatFieldUpdateOperationsInput | number
    precioVenta?: FloatFieldUpdateOperationsInput | number
    estado?: BoolFieldUpdateOperationsInput | boolean
    marca?: MarcaUpdateOneRequiredWithoutProductosNestedInput
    rubro?: RubroUpdateOneRequiredWithoutProductosNestedInput
    unidad?: UnidadUpdateOneRequiredWithoutProductosNestedInput
  }

  export type ProductoUncheckedUpdateWithoutStockProductosInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null
    rubroId?: IntFieldUpdateOperationsInput | number
    marcaId?: IntFieldUpdateOperationsInput | number
    unidadId?: IntFieldUpdateOperationsInput | number
    precioCompra?: FloatFieldUpdateOperationsInput | number
    precioVenta?: FloatFieldUpdateOperationsInput | number
    estado?: BoolFieldUpdateOperationsInput | boolean
  }

  export type DetalleMovimientoCreateWithoutMovimientoInput = {
    cantidad: number
    stock: StockPorDepositoCreateNestedOneWithoutDetallesMovimientoInput
  }

  export type DetalleMovimientoUncheckedCreateWithoutMovimientoInput = {
    id?: number
    stockId: number
    cantidad: number
  }

  export type DetalleMovimientoCreateOrConnectWithoutMovimientoInput = {
    where: DetalleMovimientoWhereUniqueInput
    create: XOR<DetalleMovimientoCreateWithoutMovimientoInput, DetalleMovimientoUncheckedCreateWithoutMovimientoInput>
  }

  export type DetalleMovimientoCreateManyMovimientoInputEnvelope = {
    data: DetalleMovimientoCreateManyMovimientoInput | DetalleMovimientoCreateManyMovimientoInput[]
    skipDuplicates?: boolean
  }

  export type DepositoCreateWithoutMovimientosInput = {
    nombre: string
    ubicacion: string
    tipo: string
    capacidad?: number | null
    estado?: boolean
    stock?: StockPorDepositoCreateNestedManyWithoutDepositoInput
  }

  export type DepositoUncheckedCreateWithoutMovimientosInput = {
    id?: number
    nombre: string
    ubicacion: string
    tipo: string
    capacidad?: number | null
    estado?: boolean
    stock?: StockPorDepositoUncheckedCreateNestedManyWithoutDepositoInput
  }

  export type DepositoCreateOrConnectWithoutMovimientosInput = {
    where: DepositoWhereUniqueInput
    create: XOR<DepositoCreateWithoutMovimientosInput, DepositoUncheckedCreateWithoutMovimientosInput>
  }

  export type TipoComprobanteCreateWithoutMovimientosInput = {
    nombre: string
  }

  export type TipoComprobanteUncheckedCreateWithoutMovimientosInput = {
    id?: number
    nombre: string
  }

  export type TipoComprobanteCreateOrConnectWithoutMovimientosInput = {
    where: TipoComprobanteWhereUniqueInput
    create: XOR<TipoComprobanteCreateWithoutMovimientosInput, TipoComprobanteUncheckedCreateWithoutMovimientosInput>
  }

  export type TipoMovimientoCreateWithoutMovimientosInput = {
    nombre: string
    ingresoEgreso: boolean
  }

  export type TipoMovimientoUncheckedCreateWithoutMovimientosInput = {
    id?: number
    nombre: string
    ingresoEgreso: boolean
  }

  export type TipoMovimientoCreateOrConnectWithoutMovimientosInput = {
    where: TipoMovimientoWhereUniqueInput
    create: XOR<TipoMovimientoCreateWithoutMovimientosInput, TipoMovimientoUncheckedCreateWithoutMovimientosInput>
  }

  export type DetalleMovimientoUpsertWithWhereUniqueWithoutMovimientoInput = {
    where: DetalleMovimientoWhereUniqueInput
    update: XOR<DetalleMovimientoUpdateWithoutMovimientoInput, DetalleMovimientoUncheckedUpdateWithoutMovimientoInput>
    create: XOR<DetalleMovimientoCreateWithoutMovimientoInput, DetalleMovimientoUncheckedCreateWithoutMovimientoInput>
  }

  export type DetalleMovimientoUpdateWithWhereUniqueWithoutMovimientoInput = {
    where: DetalleMovimientoWhereUniqueInput
    data: XOR<DetalleMovimientoUpdateWithoutMovimientoInput, DetalleMovimientoUncheckedUpdateWithoutMovimientoInput>
  }

  export type DetalleMovimientoUpdateManyWithWhereWithoutMovimientoInput = {
    where: DetalleMovimientoScalarWhereInput
    data: XOR<DetalleMovimientoUpdateManyMutationInput, DetalleMovimientoUncheckedUpdateManyWithoutMovimientoInput>
  }

  export type DepositoUpsertWithoutMovimientosInput = {
    update: XOR<DepositoUpdateWithoutMovimientosInput, DepositoUncheckedUpdateWithoutMovimientosInput>
    create: XOR<DepositoCreateWithoutMovimientosInput, DepositoUncheckedCreateWithoutMovimientosInput>
    where?: DepositoWhereInput
  }

  export type DepositoUpdateToOneWithWhereWithoutMovimientosInput = {
    where?: DepositoWhereInput
    data: XOR<DepositoUpdateWithoutMovimientosInput, DepositoUncheckedUpdateWithoutMovimientosInput>
  }

  export type DepositoUpdateWithoutMovimientosInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    ubicacion?: StringFieldUpdateOperationsInput | string
    tipo?: StringFieldUpdateOperationsInput | string
    capacidad?: NullableIntFieldUpdateOperationsInput | number | null
    estado?: BoolFieldUpdateOperationsInput | boolean
    stock?: StockPorDepositoUpdateManyWithoutDepositoNestedInput
  }

  export type DepositoUncheckedUpdateWithoutMovimientosInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    ubicacion?: StringFieldUpdateOperationsInput | string
    tipo?: StringFieldUpdateOperationsInput | string
    capacidad?: NullableIntFieldUpdateOperationsInput | number | null
    estado?: BoolFieldUpdateOperationsInput | boolean
    stock?: StockPorDepositoUncheckedUpdateManyWithoutDepositoNestedInput
  }

  export type TipoComprobanteUpsertWithoutMovimientosInput = {
    update: XOR<TipoComprobanteUpdateWithoutMovimientosInput, TipoComprobanteUncheckedUpdateWithoutMovimientosInput>
    create: XOR<TipoComprobanteCreateWithoutMovimientosInput, TipoComprobanteUncheckedCreateWithoutMovimientosInput>
    where?: TipoComprobanteWhereInput
  }

  export type TipoComprobanteUpdateToOneWithWhereWithoutMovimientosInput = {
    where?: TipoComprobanteWhereInput
    data: XOR<TipoComprobanteUpdateWithoutMovimientosInput, TipoComprobanteUncheckedUpdateWithoutMovimientosInput>
  }

  export type TipoComprobanteUpdateWithoutMovimientosInput = {
    nombre?: StringFieldUpdateOperationsInput | string
  }

  export type TipoComprobanteUncheckedUpdateWithoutMovimientosInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
  }

  export type TipoMovimientoUpsertWithoutMovimientosInput = {
    update: XOR<TipoMovimientoUpdateWithoutMovimientosInput, TipoMovimientoUncheckedUpdateWithoutMovimientosInput>
    create: XOR<TipoMovimientoCreateWithoutMovimientosInput, TipoMovimientoUncheckedCreateWithoutMovimientosInput>
    where?: TipoMovimientoWhereInput
  }

  export type TipoMovimientoUpdateToOneWithWhereWithoutMovimientosInput = {
    where?: TipoMovimientoWhereInput
    data: XOR<TipoMovimientoUpdateWithoutMovimientosInput, TipoMovimientoUncheckedUpdateWithoutMovimientosInput>
  }

  export type TipoMovimientoUpdateWithoutMovimientosInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    ingresoEgreso?: BoolFieldUpdateOperationsInput | boolean
  }

  export type TipoMovimientoUncheckedUpdateWithoutMovimientosInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    ingresoEgreso?: BoolFieldUpdateOperationsInput | boolean
  }

  export type MovimientoStockCreateWithoutDetallesInput = {
    fecha?: Date | string
    hora?: Date | string
    deposito: DepositoCreateNestedOneWithoutMovimientosInput
    tipoComprobante: TipoComprobanteCreateNestedOneWithoutMovimientosInput
    tipoMovimiento: TipoMovimientoCreateNestedOneWithoutMovimientosInput
  }

  export type MovimientoStockUncheckedCreateWithoutDetallesInput = {
    id?: number
    depositoId: number
    tipoMovimientoId: number
    tipoComprobanteId: number
    fecha?: Date | string
    hora?: Date | string
  }

  export type MovimientoStockCreateOrConnectWithoutDetallesInput = {
    where: MovimientoStockWhereUniqueInput
    create: XOR<MovimientoStockCreateWithoutDetallesInput, MovimientoStockUncheckedCreateWithoutDetallesInput>
  }

  export type StockPorDepositoCreateWithoutDetallesMovimientoInput = {
    stockActual?: number
    stockMinimo?: number
    stockMaximo?: number | null
    capacidadMaxima?: number | null
    deposito: DepositoCreateNestedOneWithoutStockInput
    producto: ProductoCreateNestedOneWithoutStockProductosInput
  }

  export type StockPorDepositoUncheckedCreateWithoutDetallesMovimientoInput = {
    id?: number
    productoId: number
    depositoId: number
    stockActual?: number
    stockMinimo?: number
    stockMaximo?: number | null
    capacidadMaxima?: number | null
  }

  export type StockPorDepositoCreateOrConnectWithoutDetallesMovimientoInput = {
    where: StockPorDepositoWhereUniqueInput
    create: XOR<StockPorDepositoCreateWithoutDetallesMovimientoInput, StockPorDepositoUncheckedCreateWithoutDetallesMovimientoInput>
  }

  export type MovimientoStockUpsertWithoutDetallesInput = {
    update: XOR<MovimientoStockUpdateWithoutDetallesInput, MovimientoStockUncheckedUpdateWithoutDetallesInput>
    create: XOR<MovimientoStockCreateWithoutDetallesInput, MovimientoStockUncheckedCreateWithoutDetallesInput>
    where?: MovimientoStockWhereInput
  }

  export type MovimientoStockUpdateToOneWithWhereWithoutDetallesInput = {
    where?: MovimientoStockWhereInput
    data: XOR<MovimientoStockUpdateWithoutDetallesInput, MovimientoStockUncheckedUpdateWithoutDetallesInput>
  }

  export type MovimientoStockUpdateWithoutDetallesInput = {
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    hora?: DateTimeFieldUpdateOperationsInput | Date | string
    deposito?: DepositoUpdateOneRequiredWithoutMovimientosNestedInput
    tipoComprobante?: TipoComprobanteUpdateOneRequiredWithoutMovimientosNestedInput
    tipoMovimiento?: TipoMovimientoUpdateOneRequiredWithoutMovimientosNestedInput
  }

  export type MovimientoStockUncheckedUpdateWithoutDetallesInput = {
    id?: IntFieldUpdateOperationsInput | number
    depositoId?: IntFieldUpdateOperationsInput | number
    tipoMovimientoId?: IntFieldUpdateOperationsInput | number
    tipoComprobanteId?: IntFieldUpdateOperationsInput | number
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    hora?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StockPorDepositoUpsertWithoutDetallesMovimientoInput = {
    update: XOR<StockPorDepositoUpdateWithoutDetallesMovimientoInput, StockPorDepositoUncheckedUpdateWithoutDetallesMovimientoInput>
    create: XOR<StockPorDepositoCreateWithoutDetallesMovimientoInput, StockPorDepositoUncheckedCreateWithoutDetallesMovimientoInput>
    where?: StockPorDepositoWhereInput
  }

  export type StockPorDepositoUpdateToOneWithWhereWithoutDetallesMovimientoInput = {
    where?: StockPorDepositoWhereInput
    data: XOR<StockPorDepositoUpdateWithoutDetallesMovimientoInput, StockPorDepositoUncheckedUpdateWithoutDetallesMovimientoInput>
  }

  export type StockPorDepositoUpdateWithoutDetallesMovimientoInput = {
    stockActual?: IntFieldUpdateOperationsInput | number
    stockMinimo?: IntFieldUpdateOperationsInput | number
    stockMaximo?: NullableIntFieldUpdateOperationsInput | number | null
    capacidadMaxima?: NullableIntFieldUpdateOperationsInput | number | null
    deposito?: DepositoUpdateOneRequiredWithoutStockNestedInput
    producto?: ProductoUpdateOneRequiredWithoutStockProductosNestedInput
  }

  export type StockPorDepositoUncheckedUpdateWithoutDetallesMovimientoInput = {
    id?: IntFieldUpdateOperationsInput | number
    productoId?: IntFieldUpdateOperationsInput | number
    depositoId?: IntFieldUpdateOperationsInput | number
    stockActual?: IntFieldUpdateOperationsInput | number
    stockMinimo?: IntFieldUpdateOperationsInput | number
    stockMaximo?: NullableIntFieldUpdateOperationsInput | number | null
    capacidadMaxima?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type MovimientoStockCreateWithoutTipoComprobanteInput = {
    fecha?: Date | string
    hora?: Date | string
    detalles?: DetalleMovimientoCreateNestedManyWithoutMovimientoInput
    deposito: DepositoCreateNestedOneWithoutMovimientosInput
    tipoMovimiento: TipoMovimientoCreateNestedOneWithoutMovimientosInput
  }

  export type MovimientoStockUncheckedCreateWithoutTipoComprobanteInput = {
    id?: number
    depositoId: number
    tipoMovimientoId: number
    fecha?: Date | string
    hora?: Date | string
    detalles?: DetalleMovimientoUncheckedCreateNestedManyWithoutMovimientoInput
  }

  export type MovimientoStockCreateOrConnectWithoutTipoComprobanteInput = {
    where: MovimientoStockWhereUniqueInput
    create: XOR<MovimientoStockCreateWithoutTipoComprobanteInput, MovimientoStockUncheckedCreateWithoutTipoComprobanteInput>
  }

  export type MovimientoStockCreateManyTipoComprobanteInputEnvelope = {
    data: MovimientoStockCreateManyTipoComprobanteInput | MovimientoStockCreateManyTipoComprobanteInput[]
    skipDuplicates?: boolean
  }

  export type MovimientoStockUpsertWithWhereUniqueWithoutTipoComprobanteInput = {
    where: MovimientoStockWhereUniqueInput
    update: XOR<MovimientoStockUpdateWithoutTipoComprobanteInput, MovimientoStockUncheckedUpdateWithoutTipoComprobanteInput>
    create: XOR<MovimientoStockCreateWithoutTipoComprobanteInput, MovimientoStockUncheckedCreateWithoutTipoComprobanteInput>
  }

  export type MovimientoStockUpdateWithWhereUniqueWithoutTipoComprobanteInput = {
    where: MovimientoStockWhereUniqueInput
    data: XOR<MovimientoStockUpdateWithoutTipoComprobanteInput, MovimientoStockUncheckedUpdateWithoutTipoComprobanteInput>
  }

  export type MovimientoStockUpdateManyWithWhereWithoutTipoComprobanteInput = {
    where: MovimientoStockScalarWhereInput
    data: XOR<MovimientoStockUpdateManyMutationInput, MovimientoStockUncheckedUpdateManyWithoutTipoComprobanteInput>
  }

  export type MovimientoStockCreateWithoutTipoMovimientoInput = {
    fecha?: Date | string
    hora?: Date | string
    detalles?: DetalleMovimientoCreateNestedManyWithoutMovimientoInput
    deposito: DepositoCreateNestedOneWithoutMovimientosInput
    tipoComprobante: TipoComprobanteCreateNestedOneWithoutMovimientosInput
  }

  export type MovimientoStockUncheckedCreateWithoutTipoMovimientoInput = {
    id?: number
    depositoId: number
    tipoComprobanteId: number
    fecha?: Date | string
    hora?: Date | string
    detalles?: DetalleMovimientoUncheckedCreateNestedManyWithoutMovimientoInput
  }

  export type MovimientoStockCreateOrConnectWithoutTipoMovimientoInput = {
    where: MovimientoStockWhereUniqueInput
    create: XOR<MovimientoStockCreateWithoutTipoMovimientoInput, MovimientoStockUncheckedCreateWithoutTipoMovimientoInput>
  }

  export type MovimientoStockCreateManyTipoMovimientoInputEnvelope = {
    data: MovimientoStockCreateManyTipoMovimientoInput | MovimientoStockCreateManyTipoMovimientoInput[]
    skipDuplicates?: boolean
  }

  export type MovimientoStockUpsertWithWhereUniqueWithoutTipoMovimientoInput = {
    where: MovimientoStockWhereUniqueInput
    update: XOR<MovimientoStockUpdateWithoutTipoMovimientoInput, MovimientoStockUncheckedUpdateWithoutTipoMovimientoInput>
    create: XOR<MovimientoStockCreateWithoutTipoMovimientoInput, MovimientoStockUncheckedCreateWithoutTipoMovimientoInput>
  }

  export type MovimientoStockUpdateWithWhereUniqueWithoutTipoMovimientoInput = {
    where: MovimientoStockWhereUniqueInput
    data: XOR<MovimientoStockUpdateWithoutTipoMovimientoInput, MovimientoStockUncheckedUpdateWithoutTipoMovimientoInput>
  }

  export type MovimientoStockUpdateManyWithWhereWithoutTipoMovimientoInput = {
    where: MovimientoStockScalarWhereInput
    data: XOR<MovimientoStockUpdateManyMutationInput, MovimientoStockUncheckedUpdateManyWithoutTipoMovimientoInput>
  }

  export type ProductoCreateManyRubroInput = {
    id?: number
    nombre: string
    descripcion?: string | null
    marcaId: number
    unidadId: number
    precioCompra: number
    precioVenta: number
    estado?: boolean
  }

  export type ProductoUpdateWithoutRubroInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null
    precioCompra?: FloatFieldUpdateOperationsInput | number
    precioVenta?: FloatFieldUpdateOperationsInput | number
    estado?: BoolFieldUpdateOperationsInput | boolean
    marca?: MarcaUpdateOneRequiredWithoutProductosNestedInput
    unidad?: UnidadUpdateOneRequiredWithoutProductosNestedInput
    stockProductos?: StockPorDepositoUpdateManyWithoutProductoNestedInput
  }

  export type ProductoUncheckedUpdateWithoutRubroInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null
    marcaId?: IntFieldUpdateOperationsInput | number
    unidadId?: IntFieldUpdateOperationsInput | number
    precioCompra?: FloatFieldUpdateOperationsInput | number
    precioVenta?: FloatFieldUpdateOperationsInput | number
    estado?: BoolFieldUpdateOperationsInput | boolean
    stockProductos?: StockPorDepositoUncheckedUpdateManyWithoutProductoNestedInput
  }

  export type ProductoUncheckedUpdateManyWithoutRubroInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null
    marcaId?: IntFieldUpdateOperationsInput | number
    unidadId?: IntFieldUpdateOperationsInput | number
    precioCompra?: FloatFieldUpdateOperationsInput | number
    precioVenta?: FloatFieldUpdateOperationsInput | number
    estado?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ProductoCreateManyUnidadInput = {
    id?: number
    nombre: string
    descripcion?: string | null
    rubroId: number
    marcaId: number
    precioCompra: number
    precioVenta: number
    estado?: boolean
  }

  export type ProductoUpdateWithoutUnidadInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null
    precioCompra?: FloatFieldUpdateOperationsInput | number
    precioVenta?: FloatFieldUpdateOperationsInput | number
    estado?: BoolFieldUpdateOperationsInput | boolean
    marca?: MarcaUpdateOneRequiredWithoutProductosNestedInput
    rubro?: RubroUpdateOneRequiredWithoutProductosNestedInput
    stockProductos?: StockPorDepositoUpdateManyWithoutProductoNestedInput
  }

  export type ProductoUncheckedUpdateWithoutUnidadInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null
    rubroId?: IntFieldUpdateOperationsInput | number
    marcaId?: IntFieldUpdateOperationsInput | number
    precioCompra?: FloatFieldUpdateOperationsInput | number
    precioVenta?: FloatFieldUpdateOperationsInput | number
    estado?: BoolFieldUpdateOperationsInput | boolean
    stockProductos?: StockPorDepositoUncheckedUpdateManyWithoutProductoNestedInput
  }

  export type ProductoUncheckedUpdateManyWithoutUnidadInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null
    rubroId?: IntFieldUpdateOperationsInput | number
    marcaId?: IntFieldUpdateOperationsInput | number
    precioCompra?: FloatFieldUpdateOperationsInput | number
    precioVenta?: FloatFieldUpdateOperationsInput | number
    estado?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ProductoCreateManyMarcaInput = {
    id?: number
    nombre: string
    descripcion?: string | null
    rubroId: number
    unidadId: number
    precioCompra: number
    precioVenta: number
    estado?: boolean
  }

  export type ProductoUpdateWithoutMarcaInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null
    precioCompra?: FloatFieldUpdateOperationsInput | number
    precioVenta?: FloatFieldUpdateOperationsInput | number
    estado?: BoolFieldUpdateOperationsInput | boolean
    rubro?: RubroUpdateOneRequiredWithoutProductosNestedInput
    unidad?: UnidadUpdateOneRequiredWithoutProductosNestedInput
    stockProductos?: StockPorDepositoUpdateManyWithoutProductoNestedInput
  }

  export type ProductoUncheckedUpdateWithoutMarcaInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null
    rubroId?: IntFieldUpdateOperationsInput | number
    unidadId?: IntFieldUpdateOperationsInput | number
    precioCompra?: FloatFieldUpdateOperationsInput | number
    precioVenta?: FloatFieldUpdateOperationsInput | number
    estado?: BoolFieldUpdateOperationsInput | boolean
    stockProductos?: StockPorDepositoUncheckedUpdateManyWithoutProductoNestedInput
  }

  export type ProductoUncheckedUpdateManyWithoutMarcaInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null
    rubroId?: IntFieldUpdateOperationsInput | number
    unidadId?: IntFieldUpdateOperationsInput | number
    precioCompra?: FloatFieldUpdateOperationsInput | number
    precioVenta?: FloatFieldUpdateOperationsInput | number
    estado?: BoolFieldUpdateOperationsInput | boolean
  }

  export type StockPorDepositoCreateManyProductoInput = {
    id?: number
    depositoId: number
    stockActual?: number
    stockMinimo?: number
    stockMaximo?: number | null
    capacidadMaxima?: number | null
  }

  export type StockPorDepositoUpdateWithoutProductoInput = {
    stockActual?: IntFieldUpdateOperationsInput | number
    stockMinimo?: IntFieldUpdateOperationsInput | number
    stockMaximo?: NullableIntFieldUpdateOperationsInput | number | null
    capacidadMaxima?: NullableIntFieldUpdateOperationsInput | number | null
    detallesMovimiento?: DetalleMovimientoUpdateManyWithoutStockNestedInput
    deposito?: DepositoUpdateOneRequiredWithoutStockNestedInput
  }

  export type StockPorDepositoUncheckedUpdateWithoutProductoInput = {
    id?: IntFieldUpdateOperationsInput | number
    depositoId?: IntFieldUpdateOperationsInput | number
    stockActual?: IntFieldUpdateOperationsInput | number
    stockMinimo?: IntFieldUpdateOperationsInput | number
    stockMaximo?: NullableIntFieldUpdateOperationsInput | number | null
    capacidadMaxima?: NullableIntFieldUpdateOperationsInput | number | null
    detallesMovimiento?: DetalleMovimientoUncheckedUpdateManyWithoutStockNestedInput
  }

  export type StockPorDepositoUncheckedUpdateManyWithoutProductoInput = {
    id?: IntFieldUpdateOperationsInput | number
    depositoId?: IntFieldUpdateOperationsInput | number
    stockActual?: IntFieldUpdateOperationsInput | number
    stockMinimo?: IntFieldUpdateOperationsInput | number
    stockMaximo?: NullableIntFieldUpdateOperationsInput | number | null
    capacidadMaxima?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type MovimientoStockCreateManyDepositoInput = {
    id?: number
    tipoMovimientoId: number
    tipoComprobanteId: number
    fecha?: Date | string
    hora?: Date | string
  }

  export type StockPorDepositoCreateManyDepositoInput = {
    id?: number
    productoId: number
    stockActual?: number
    stockMinimo?: number
    stockMaximo?: number | null
    capacidadMaxima?: number | null
  }

  export type MovimientoStockUpdateWithoutDepositoInput = {
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    hora?: DateTimeFieldUpdateOperationsInput | Date | string
    detalles?: DetalleMovimientoUpdateManyWithoutMovimientoNestedInput
    tipoComprobante?: TipoComprobanteUpdateOneRequiredWithoutMovimientosNestedInput
    tipoMovimiento?: TipoMovimientoUpdateOneRequiredWithoutMovimientosNestedInput
  }

  export type MovimientoStockUncheckedUpdateWithoutDepositoInput = {
    id?: IntFieldUpdateOperationsInput | number
    tipoMovimientoId?: IntFieldUpdateOperationsInput | number
    tipoComprobanteId?: IntFieldUpdateOperationsInput | number
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    hora?: DateTimeFieldUpdateOperationsInput | Date | string
    detalles?: DetalleMovimientoUncheckedUpdateManyWithoutMovimientoNestedInput
  }

  export type MovimientoStockUncheckedUpdateManyWithoutDepositoInput = {
    id?: IntFieldUpdateOperationsInput | number
    tipoMovimientoId?: IntFieldUpdateOperationsInput | number
    tipoComprobanteId?: IntFieldUpdateOperationsInput | number
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    hora?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StockPorDepositoUpdateWithoutDepositoInput = {
    stockActual?: IntFieldUpdateOperationsInput | number
    stockMinimo?: IntFieldUpdateOperationsInput | number
    stockMaximo?: NullableIntFieldUpdateOperationsInput | number | null
    capacidadMaxima?: NullableIntFieldUpdateOperationsInput | number | null
    detallesMovimiento?: DetalleMovimientoUpdateManyWithoutStockNestedInput
    producto?: ProductoUpdateOneRequiredWithoutStockProductosNestedInput
  }

  export type StockPorDepositoUncheckedUpdateWithoutDepositoInput = {
    id?: IntFieldUpdateOperationsInput | number
    productoId?: IntFieldUpdateOperationsInput | number
    stockActual?: IntFieldUpdateOperationsInput | number
    stockMinimo?: IntFieldUpdateOperationsInput | number
    stockMaximo?: NullableIntFieldUpdateOperationsInput | number | null
    capacidadMaxima?: NullableIntFieldUpdateOperationsInput | number | null
    detallesMovimiento?: DetalleMovimientoUncheckedUpdateManyWithoutStockNestedInput
  }

  export type StockPorDepositoUncheckedUpdateManyWithoutDepositoInput = {
    id?: IntFieldUpdateOperationsInput | number
    productoId?: IntFieldUpdateOperationsInput | number
    stockActual?: IntFieldUpdateOperationsInput | number
    stockMinimo?: IntFieldUpdateOperationsInput | number
    stockMaximo?: NullableIntFieldUpdateOperationsInput | number | null
    capacidadMaxima?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type DetalleMovimientoCreateManyStockInput = {
    id?: number
    movimientoId: number
    cantidad: number
  }

  export type DetalleMovimientoUpdateWithoutStockInput = {
    cantidad?: IntFieldUpdateOperationsInput | number
    movimiento?: MovimientoStockUpdateOneRequiredWithoutDetallesNestedInput
  }

  export type DetalleMovimientoUncheckedUpdateWithoutStockInput = {
    id?: IntFieldUpdateOperationsInput | number
    movimientoId?: IntFieldUpdateOperationsInput | number
    cantidad?: IntFieldUpdateOperationsInput | number
  }

  export type DetalleMovimientoUncheckedUpdateManyWithoutStockInput = {
    id?: IntFieldUpdateOperationsInput | number
    movimientoId?: IntFieldUpdateOperationsInput | number
    cantidad?: IntFieldUpdateOperationsInput | number
  }

  export type DetalleMovimientoCreateManyMovimientoInput = {
    id?: number
    stockId: number
    cantidad: number
  }

  export type DetalleMovimientoUpdateWithoutMovimientoInput = {
    cantidad?: IntFieldUpdateOperationsInput | number
    stock?: StockPorDepositoUpdateOneRequiredWithoutDetallesMovimientoNestedInput
  }

  export type DetalleMovimientoUncheckedUpdateWithoutMovimientoInput = {
    id?: IntFieldUpdateOperationsInput | number
    stockId?: IntFieldUpdateOperationsInput | number
    cantidad?: IntFieldUpdateOperationsInput | number
  }

  export type DetalleMovimientoUncheckedUpdateManyWithoutMovimientoInput = {
    id?: IntFieldUpdateOperationsInput | number
    stockId?: IntFieldUpdateOperationsInput | number
    cantidad?: IntFieldUpdateOperationsInput | number
  }

  export type MovimientoStockCreateManyTipoComprobanteInput = {
    id?: number
    depositoId: number
    tipoMovimientoId: number
    fecha?: Date | string
    hora?: Date | string
  }

  export type MovimientoStockUpdateWithoutTipoComprobanteInput = {
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    hora?: DateTimeFieldUpdateOperationsInput | Date | string
    detalles?: DetalleMovimientoUpdateManyWithoutMovimientoNestedInput
    deposito?: DepositoUpdateOneRequiredWithoutMovimientosNestedInput
    tipoMovimiento?: TipoMovimientoUpdateOneRequiredWithoutMovimientosNestedInput
  }

  export type MovimientoStockUncheckedUpdateWithoutTipoComprobanteInput = {
    id?: IntFieldUpdateOperationsInput | number
    depositoId?: IntFieldUpdateOperationsInput | number
    tipoMovimientoId?: IntFieldUpdateOperationsInput | number
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    hora?: DateTimeFieldUpdateOperationsInput | Date | string
    detalles?: DetalleMovimientoUncheckedUpdateManyWithoutMovimientoNestedInput
  }

  export type MovimientoStockUncheckedUpdateManyWithoutTipoComprobanteInput = {
    id?: IntFieldUpdateOperationsInput | number
    depositoId?: IntFieldUpdateOperationsInput | number
    tipoMovimientoId?: IntFieldUpdateOperationsInput | number
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    hora?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MovimientoStockCreateManyTipoMovimientoInput = {
    id?: number
    depositoId: number
    tipoComprobanteId: number
    fecha?: Date | string
    hora?: Date | string
  }

  export type MovimientoStockUpdateWithoutTipoMovimientoInput = {
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    hora?: DateTimeFieldUpdateOperationsInput | Date | string
    detalles?: DetalleMovimientoUpdateManyWithoutMovimientoNestedInput
    deposito?: DepositoUpdateOneRequiredWithoutMovimientosNestedInput
    tipoComprobante?: TipoComprobanteUpdateOneRequiredWithoutMovimientosNestedInput
  }

  export type MovimientoStockUncheckedUpdateWithoutTipoMovimientoInput = {
    id?: IntFieldUpdateOperationsInput | number
    depositoId?: IntFieldUpdateOperationsInput | number
    tipoComprobanteId?: IntFieldUpdateOperationsInput | number
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    hora?: DateTimeFieldUpdateOperationsInput | Date | string
    detalles?: DetalleMovimientoUncheckedUpdateManyWithoutMovimientoNestedInput
  }

  export type MovimientoStockUncheckedUpdateManyWithoutTipoMovimientoInput = {
    id?: IntFieldUpdateOperationsInput | number
    depositoId?: IntFieldUpdateOperationsInput | number
    tipoComprobanteId?: IntFieldUpdateOperationsInput | number
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    hora?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}