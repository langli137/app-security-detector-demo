import { TaroNode } from './node.js';
import { NodeType } from './node_types.js';

declare class TaroText extends TaroNode {
    _value: string;
    nodeType: NodeType;
    nodeName: string;
    constructor(value: any);
    set textContent(text: string);
    get textContent(): string;
    set nodeValue(text: string);
    get nodeValue(): string;
    set data(text: string);
    get data(): string;
}

export { TaroText };
