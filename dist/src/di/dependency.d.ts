import { Contracts as c } from "@bonbons/contracts";
declare type DeptNode = c.BonbonsDeptNode;
export declare class DependencyQueue {
    private queue;
    private sections;
    addNode({ el, realel, scope, deps }: DeptNode): void;
    sort(): DeptNode[];
    private decideSection;
}
export {};
