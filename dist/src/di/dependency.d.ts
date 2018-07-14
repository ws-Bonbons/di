import { Contracts as api } from "@bonbons/contracts";
declare type DeptNode = api.BonbonsDeptNode;
export declare class DependencyQueue {
    private queue;
    private sections;
    addNode({ el, realel, scope, deps }: DeptNode): void;
    sort(): DeptNode[];
    private decideSection;
}
export {};
