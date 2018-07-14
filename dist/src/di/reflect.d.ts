import "reflect-metadata";
import { Contracts as c } from "@bonbons/contracts";
export declare function getDependencies(target: any): any[];
export declare class ReflectionConstructor {
    GetInjections(target: any): any[];
    GetControllerMetadata(target: any): c.IBonbonsControllerMetadata;
    SetControllerMetadata(target: any, meta: c.IBonbonsControllerMetadata): void;
    GetPipeMetadata(target: any): c.IBonbonsPipeMetadata;
    SetPipeMetadata(target: any, meta: c.IBonbonsPipeMetadata): void;
}
export declare const Reflection: ReflectionConstructor;
