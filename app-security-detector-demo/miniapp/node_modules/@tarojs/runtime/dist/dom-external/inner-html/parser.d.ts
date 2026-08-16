interface Node {
    type: string;
}
interface Comment extends Node {
    type: 'comment';
    content: string;
}
interface Text extends Node {
    type: 'text';
    content: string;
}
interface Element extends Node {
    type: 'element';
    tagName: string;
    children: ChildNode[];
    attributes: string[];
}
type ChildNode = Comment | Text | Element;

export type { Element, Text };
