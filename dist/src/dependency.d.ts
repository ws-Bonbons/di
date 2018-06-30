import { BonbonsDeptNode } from "@bonbons/contracts";
export declare class DependencyQueue {
    private queue;
    private sections;
    addNode({ el, realel, scope, deps }: BonbonsDeptNode): void;
    sort(): BonbonsDeptNode[];
    private decideSection;
}
