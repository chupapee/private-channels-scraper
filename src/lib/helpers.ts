const MAX_STORIES_SIZE = 45;

export const timeout = (sec: number): Promise<null> =>
  new Promise((ok) => setTimeout(ok, sec));

export function chunkMediafiles(files: Record<string, any>) {
  return files.reduce(
    (acc: Array<Record<string, any>[]>, curr: Record<string, any>) => {
      const tempAccWithCurr = [...acc[acc.length - 1], curr];
      if (
        tempAccWithCurr.length === 10 ||
        sumOfSizes(tempAccWithCurr) >= MAX_STORIES_SIZE
      ) {
        acc.push([curr]);
        return acc;
      }
      acc[acc.length - 1].push(curr);
      return acc;
    },
    [[]]
  );
}

function sumOfSizes(list: { bufferSize?: number }[]) {
  return list.reduce((acc, curr) => {
    if (curr.bufferSize) {
      return acc + curr.bufferSize;
    }
    return acc;
  }, 0);
}
