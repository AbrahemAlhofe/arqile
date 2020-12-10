import Payload from "./payload";
import Recipe from "./recipe";

export interface IActions {

  $take: (object | number)[] | number;

  $ignore: string[];

  $keyName: string | Function;

  $include( data: any ): object;

  $value: string | Function;

}

export type TLayerHandler = (payload: Payload, recipe: Recipe) => Promise<any>; 

export type TLayerMatcher = (payload: Payload, recipe: Recipe) => Boolean;

export interface IHandler<T> {
  $value(...args: any[]): void;
  $keyName(...args: any[]): void;
  $take(...args: any[]): void;
  $ignore(...args: any[]): void;
  $include(...args: any[]): void;

  apply(recipe: Record<string, any>, onQuery: Function): Promise<T>
}