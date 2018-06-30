import "reflect-metadata";
import { IBonbonsControllerMetadata, IBonbonsPipeMetadata } from "@bonbons/contracts";
export declare function getDependencies(target: any): any[];
export declare class ReflectionConstructor {
    GetInjections(target: any): any[];
    GetControllerMetadata(target: any): IBonbonsControllerMetadata;
    SetControllerMetadata(target: any, meta: IBonbonsControllerMetadata): void;
    GetPipeMetadata(target: any): IBonbonsPipeMetadata;
    SetPipeMetadata(target: any, meta: IBonbonsPipeMetadata): void;
}
export declare const Reflection: ReflectionConstructor;
