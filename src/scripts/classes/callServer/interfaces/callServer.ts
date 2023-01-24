export interface CallServerInterface {
    endpoint: string;
    // baseBody: FormData;
    converter(data: string): object;
    // setBaseBody(): void;
    getData(): Promise<Object>;
    render(): void;
}