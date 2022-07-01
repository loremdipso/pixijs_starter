
export function time(callback: Function, _label: string) {
    // const start = performance.now();
    callback();
    // console.log(`Elapsed for ${label}: ${performance.now() - start}`);
}

export async function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
