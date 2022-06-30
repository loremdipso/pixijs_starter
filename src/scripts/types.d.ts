
declare module "*.png";
declare module "*.jpg";
declare module "*.gif";
declare module "*.svg";

declare interface IUpdatable {
    update: (delta: number) => void;
}