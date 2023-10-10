export class Opcode {
  public execute(opcode: string, stack: string): string {
    switch (opcode) {
      case "add": {
        // Remove the square bracket []
        let a = stack.slice(1, -1);

        // Find the first ","
        const firstEIndex = a.indexOf(",");

        // Find the second "," after the first one
        const secondEIndex = a.indexOf(",", firstEIndex + 1);

        let item1 = a.slice(0, firstEIndex).trim();
        let item2 = a.slice(firstEIndex + 1, secondEIndex).trim();

        let newStack = `[${item1} + ${item2},${a.slice(secondEIndex + 1)}]`;

        return newStack;
      }
      case "sub": {
        // Remove the square bracket []
        let a = stack.slice(1, -1);

        // Find the first ","
        const firstEIndex = a.indexOf(",");

        // Find the second "," after the first one
        const secondEIndex = a.indexOf(",", firstEIndex + 1);

        let item1 = a.slice(0, firstEIndex).trim();
        let item2 = a.slice(firstEIndex + 1, secondEIndex).trim();

        let newStack = `[${item1} - ${item2},${a.slice(secondEIndex + 1)}]`;

        return newStack;
      }
      default: {
        return "[error]";
      }
    }
  }
}
