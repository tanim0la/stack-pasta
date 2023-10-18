import * as vscode from "vscode";

export class Opcode {
  public filterStack(arr: string[]): string[] {
    let filteredStack = [];

    for (let item of arr) {
      if (item.trim() !== "") {
        filteredStack.push(item.trim());
      }
    }
    return filteredStack;
  }

  protected getStack(stack: string): string[] {
    const a: string = stack.slice(1, -1);

    let filteredStack = this.filterStack(a.split(","));

    if (filteredStack.length <= 2) {
      return filteredStack;
    }

    // Find the first ","
    const firstEIndex = a.indexOf(",");

    // Find the second "," after the first one
    const secondEIndex = a.indexOf(",", firstEIndex + 1);

    let item1 = a.slice(0, firstEIndex).trim();
    let item2 = a.slice(firstEIndex + 1, secondEIndex).trim();

    return [item1, item2, a.slice(secondEIndex + 1)];
  }

  public execute(opcode: string, stack: string): string {
    let tempOpcode = opcode;
    if (tempOpcode.includes("0x")) {
      opcode = "push";
    } else if (
      tempOpcode.slice(0, 3) === "dup" &&
      parseInt(tempOpcode.slice(3)) <= 16
    ) {
      opcode = "dup";
    } else if (
      tempOpcode.slice(0, 4) === "swap" &&
      parseInt(tempOpcode.slice(4)) <= 16
    ) {
      opcode = "swap";
    }

    switch (opcode) {
      case "add": {
        let getStack = this.getStack(stack);
        let newStack = `[${getStack[0]} + ${getStack[1]}${
          getStack.length > 2 ? "," + getStack[2] : ""
        }]`;
        return newStack;
      }
      case "mul": {
        let getStack = this.getStack(stack);
        let newStack = `[${getStack[0]} * ${getStack[1]}${
          getStack.length > 2 ? "," + getStack[2] : ""
        }]`;
        return newStack;
      }
      case "sub": {
        let getStack = this.getStack(stack);
        let newStack = `[${getStack[0]} - ${getStack[1]}${
          getStack.length > 2 ? "," + getStack[2] : ""
        }]`;
        return newStack;
      }
      case "div" || "sdiv": {
        let getStack = this.getStack(stack);
        let newStack = `[${getStack[0]} // ${getStack[1]}${
          getStack.length > 2 ? "," + getStack[2] : ""
        }]`;
        return newStack;
      }
      case "mod" || "smod": {
        let getStack = this.getStack(stack);
        let newStack = `[${getStack[0]} % ${getStack[1]}${
          getStack.length > 2 ? "," + getStack[2] : ""
        }]`;
        return newStack;
      }
      case "addmod": {
        let getStack = this.getStack(stack);
        let newStack = `[(${getStack[0]} + ${getStack[1]}),${getStack[2]}]`;
        newStack = this.execute("mod", newStack);
        return newStack;
      }
      case "mulmod": {
        let getStack = this.getStack(stack);
        let newStack = `[(${getStack[0]} * ${getStack[1]}),${getStack[2]}]`;
        newStack = this.execute("mod", newStack);
        return newStack;
      }
      case "exp": {
        let getStack = this.getStack(stack);
        let newStack = `[${getStack[0]} ** ${getStack[1]}${
          getStack.length > 2 ? "," + getStack[2] : ""
        }]`;
        return newStack;
      }
      case "signextend": {
        // let getStack = this.getStack(stack);
        // let newStack = `[${getStack[0]} - ${getStack[1]},${getStack[2]}]`;
        // return newStack;
      }
      case "lt" || "slt": {
        let getStack = this.getStack(stack);
        let newStack = `[${getStack[0]} < ${getStack[1]}${
          getStack.length > 2 ? "," + getStack[2] : ""
        }]`;
        return newStack;
      }
      case "gt" || "sgt": {
        let getStack = this.getStack(stack);
        let newStack = `[${getStack[0]} > ${getStack[1]}${
          getStack.length > 2 ? "," + getStack[2] : ""
        }]`;
        return newStack;
      }
      case "eq": {
        let getStack = this.getStack(stack);
        let newStack = `[${getStack[0]} == ${getStack[1]}${
          getStack.length > 2 ? "," + getStack[2] : ""
        }]`;
        return newStack;
      }
      case "iszero": {
        let getStack = this.getStack(stack);
        let newStack;

        if (getStack.length <= 1) {
          newStack = `[${getStack[0]} == 0]`;
        } else {
          newStack = `[${getStack[0]} == 0, ${getStack[1]}${
            getStack.length > 2 ? "," + getStack[2] : ""
          }]`;
        }
        return newStack;
      }
      case "and": {
        let getStack = this.getStack(stack);
        let newStack = `[${getStack[0]} & ${getStack[1]}${
          getStack.length > 2 ? "," + getStack[2] : ""
        }]`;
        return newStack;
      }
      case "or": {
        let getStack = this.getStack(stack);
        let newStack = `[${getStack[0]} | ${getStack[1]}${
          getStack.length > 2 ? "," + getStack[2] : ""
        }]`;
        return newStack;
      }
      case "xor": {
        let getStack = this.getStack(stack);
        let newStack = `[${getStack[0]} ^ ${getStack[1]}${
          getStack.length > 2 ? "," + getStack[2] : ""
        }]`;
        return newStack;
      }
      case "not": {
        let getStack = this.getStack(stack);
        let newStack;

        if (getStack.length <= 1) {
          newStack = `[~${getStack[0]}]`;
        } else {
          newStack = `[~${getStack[0]}, ${getStack[1]}${
            getStack.length > 2 ? "," + getStack[2] : ""
          }]`;
        }
        return newStack;
      }
      case "byte": {
        // let getStack = this.getStack(stack);
        // let newStack = `[${getStack[0]} < ${getStack[1]},${getStack[2]}]`;
        // return newStack;
      }
      case "shl": {
        let getStack = this.getStack(stack);
        let newStack = `[${getStack[1]} << ${getStack[0]}${
          getStack.length > 2 ? "," + getStack[2] : ""
        }]`;
        return newStack;
      }
      case "shr" || "sar": {
        let getStack = this.getStack(stack);
        let newStack = `[${getStack[1]} >> ${getStack[0]}${
          getStack.length > 2 ? "," + getStack[2] : ""
        }]`;
        return newStack;
      }
      case "sha3": {
        let getStack = this.getStack(stack);
        let newStack;

        if (getStack[0] !== undefined && getStack[1] !== undefined) {
          newStack = `[hash${getStack.length > 2 ? "," + getStack[2] : ""}]`;
        } else {
          newStack = `[undefinedHash${
            getStack.length > 2 ? "," + getStack[2] : ""
          }]`;
        }

        return newStack;
      }
      case "address": {
        let getStack = this.getStack(stack);
        let newStack;

        if (getStack.length === 0) {
          newStack = `[address]`;
        } else if (getStack.length === 1) {
          newStack = `[address, ${getStack[0]}]`;
        } else {
          newStack = `[address, ${getStack[0]}, ${getStack[1]}${
            getStack.length > 2 ? "," + getStack[2] : ""
          }]`;
        }
        return newStack;
      }
      case "balance": {
        let getStack = this.getStack(stack);
        let newStack;

        if (getStack.length === 0) {
          newStack = `[undefined]`;
        } else if (getStack.length === 1) {
          newStack = `[balance]`;
        } else {
          newStack = `[balance, ${getStack[1]}${
            getStack.length > 2 ? "," + getStack[2] : ""
          }]`;
        }
        return newStack;
      }
      case "origin": {
        let getStack = this.getStack(stack);
        let newStack;

        if (getStack.length === 0) {
          newStack = `[originAddr]`;
        } else if (getStack.length === 1) {
          newStack = `[originAddr, ${getStack[0]}]`;
        } else {
          newStack = `[originAddr, ${getStack[0]}, ${getStack[1]}${
            getStack.length > 2 ? "," + getStack[2] : ""
          }]`;
        }
        return newStack;
      }
      case "caller": {
        let getStack = this.getStack(stack);
        let newStack;

        if (getStack.length === 0) {
          newStack = `[msg.sender]`;
        } else if (getStack.length === 1) {
          newStack = `[msg.sender, ${getStack[0]}]`;
        } else {
          newStack = `[msg.sender, ${getStack[0]}, ${getStack[1]}${
            getStack.length > 2 ? "," + getStack[2] : ""
          }]`;
        }
        return newStack;
      }
      case "callvalue": {
        let getStack = this.getStack(stack);
        let newStack;

        if (getStack.length === 0) {
          newStack = `[value]`;
        } else if (getStack.length === 1) {
          newStack = `[value, ${getStack[0]}]`;
        } else {
          newStack = `[value, ${getStack[0]}, ${getStack[1]}${
            getStack.length > 2 ? "," + getStack[2] : ""
          }]`;
        }
        return newStack;
      }
      case "calldataload": {
        let getStack = this.getStack(stack);
        let newStack;

        if (getStack.length <= 1) {
          newStack = `[data[${getStack[0]}]]`;
        } else {
          newStack = `[data[${getStack[0]}], ${getStack[1]}${
            getStack.length > 2 ? "," + getStack[2] : ""
          }]`;
        }
        return newStack;
      }
      case "calldatasize": {
        let getStack = this.getStack(stack);
        let newStack;

        if (getStack.length === 0) {
          newStack = `[size]`;
        } else if (getStack.length === 1) {
          newStack = `[size, ${getStack[0]}]`;
        } else {
          newStack = `[size, ${getStack[0]}, ${getStack[1]}${
            getStack.length > 2 ? "," + getStack[2] : ""
          }]`;
        }
        return newStack;
      }
      case "calldatacopy" || "codecopy" || "returndatacopy": {
        let getStack = this.getStack(stack);
        let newStack;

        if (getStack.length < 3) {
          newStack = "[undefined]";
        } else {
          getStack = this.getStack(`[${getStack[2].trim()}]`);

          if (getStack.length === 1) {
            newStack = "[]";
          } else {
            newStack = `[${getStack[1]}${
              getStack.length > 2 ? "," + getStack[2] : ""
            }]`;
          }
        }
        return newStack;
      }
      case "codesize": {
        let getStack = this.getStack(stack);
        let newStack;

        if (getStack.length === 0) {
          newStack = `[size]`;
        } else if (getStack.length === 1) {
          newStack = `[size, ${getStack[0]}]`;
        } else {
          newStack = `[size, ${getStack[0]}, ${getStack[1]}${
            getStack.length > 2 ? "," + getStack[2] : ""
          }]`;
        }
        return newStack;
      }
      // case "codecopy": {
      //   let getStack = this.getStack(stack);
      //   let newStack;

      //   if (getStack.length < 3) {
      //     newStack = "[undefined]";
      //   } else {
      //     getStack = this.getStack(`[${getStack[2].trim()}]`);

      //     if (getStack.length === 1) {
      //       newStack = "[]";
      //     } else {
      //       newStack = `[${getStack[1]}${
      //         getStack.length > 2 ? "," + getStack[2] : ""
      //       }]`;
      //     }
      //   }
      //   return newStack;
      // }
      case "gasprice": {
        let getStack = this.getStack(stack);
        let newStack;

        if (getStack.length === 0) {
          newStack = `[gasPrice]`;
        } else if (getStack.length === 1) {
          newStack = `[gasPrice, ${getStack[0]}]`;
        } else {
          newStack = `[gasPrice, ${getStack[0]}, ${getStack[1]}${
            getStack.length > 2 ? "," + getStack[2] : ""
          }]`;
        }
        return newStack;
      }
      case "extcodesize": {
        let getStack = this.getStack(stack);
        let newStack;

        if (getStack.length === 0) {
          newStack = `[${getStack[0]}]`;
        } else if (getStack.length === 1) {
          newStack = `[extCodeSize]`;
        } else {
          newStack = `[extCodeSize, ${getStack[1]}${
            getStack.length > 2 ? "," + getStack[2] : ""
          }]`;
        }
        return newStack;
      }
      case "extcodecopy": {
        let getStack = this.getStack(stack);
        let newStack;

        if (getStack.length < 3) {
          newStack = "[undefined]";
        } else {
          getStack = this.getStack(`[${getStack[2].trim()}]`);

          if (getStack.length < 2) {
            newStack = "[undefined]";
          } else if (getStack.length === 2) {
            newStack = "[]";
          } else {
            newStack = `[${getStack[2].trim()}]`;
          }
        }
        return newStack;
      }
      case "returndatasize": {
        let getStack = this.getStack(stack);
        let newStack;

        if (getStack.length === 0) {
          newStack = `[returnDataSize]`;
        } else if (getStack.length === 1) {
          newStack = `[returnDataSize, ${getStack[0]}]`;
        } else {
          newStack = `[returnDataSize, ${getStack[0]}, ${getStack[1]}${
            getStack.length > 2 ? "," + getStack[2] : ""
          }]`;
        }
        return newStack;
      }
      case "extcodehash": {
        let getStack = this.getStack(stack);
        let newStack;

        if (getStack.length === 0) {
          newStack = `[${getStack[0]}]`;
        } else if (getStack.length === 1) {
          newStack = `[extCodeHash]`;
        } else {
          newStack = `[extCodeHash, ${getStack[1]}${
            getStack.length > 2 ? "," + getStack[2] : ""
          }]`;
        }
        return newStack;
      }
      case "blockhash": {
        let getStack = this.getStack(stack);
        let newStack;

        if (getStack.length === 0) {
          newStack = `[${getStack[0]}]`;
        } else if (getStack.length === 1) {
          newStack = `[blockHash]`;
        } else {
          newStack = `[blockHash, ${getStack[1]}${
            getStack.length > 2 ? "," + getStack[2] : ""
          }]`;
        }
        return newStack;
      }
      case "coinbase": {
        let getStack = this.getStack(stack);
        let newStack;

        if (getStack.length === 0) {
          newStack = `[coinbaseAddr]`;
        } else if (getStack.length === 1) {
          newStack = `[coinbaseAddr, ${getStack[0]}]`;
        } else {
          newStack = `[coinbaseAddr, ${getStack[0]}, ${getStack[1]}${
            getStack.length > 2 ? "," + getStack[2] : ""
          }]`;
        }
        return newStack;
      }
      case "timestamp": {
        let getStack = this.getStack(stack);
        let newStack;

        if (getStack.length === 0) {
          newStack = `[timestamp]`;
        } else if (getStack.length === 1) {
          newStack = `[timestamp, ${getStack[0]}]`;
        } else {
          newStack = `[timestamp, ${getStack[0]}, ${getStack[1]}${
            getStack.length > 2 ? "," + getStack[2] : ""
          }]`;
        }
        return newStack;
      }
      case "number": {
        let getStack = this.getStack(stack);
        let newStack;

        if (getStack.length === 0) {
          newStack = `[blockNumber]`;
        } else if (getStack.length === 1) {
          newStack = `[blockNumber, ${getStack[0]}]`;
        } else {
          newStack = `[blockNumber, ${getStack[0]}, ${getStack[1]}${
            getStack.length > 2 ? "," + getStack[2] : ""
          }]`;
        }
        return newStack;
      }
      case "prevrandao": {
        let getStack = this.getStack(stack);
        let newStack;

        if (getStack.length === 0) {
          newStack = `[prevRandao]`;
        } else if (getStack.length === 1) {
          newStack = `[prevRandao, ${getStack[0]}]`;
        } else {
          newStack = `[prevRandao, ${getStack[0]}, ${getStack[1]}${
            getStack.length > 2 ? "," + getStack[2] : ""
          }]`;
        }
        return newStack;
      }
      case "gaslimit": {
        let getStack = this.getStack(stack);
        let newStack;

        if (getStack.length === 0) {
          newStack = `[gasLimit]`;
        } else if (getStack.length === 1) {
          newStack = `[gasLimit, ${getStack[0]}]`;
        } else {
          newStack = `[gasLimit, ${getStack[0]}, ${getStack[1]}${
            getStack.length > 2 ? "," + getStack[2] : ""
          }]`;
        }
        return newStack;
      }
      case "chainid": {
        let getStack = this.getStack(stack);
        let newStack;

        if (getStack.length === 0) {
          newStack = `[chainId]`;
        } else if (getStack.length === 1) {
          newStack = `[chainId, ${getStack[0]}]`;
        } else {
          newStack = `[chainId, ${getStack[0]}, ${getStack[1]}${
            getStack.length > 2 ? "," + getStack[2] : ""
          }]`;
        }
        return newStack;
      }
      case "selfbalance": {
        let getStack = this.getStack(stack);
        let newStack;

        if (getStack.length === 0) {
          newStack = `[balance]`;
        } else if (getStack.length === 1) {
          newStack = `[balance, ${getStack[0]}]`;
        } else {
          newStack = `[balance, ${getStack[0]}, ${getStack[1]}${
            getStack.length > 2 ? "," + getStack[2] : ""
          }]`;
        }
        return newStack;
      }
      case "basefee": {
        let getStack = this.getStack(stack);
        let newStack;

        if (getStack.length === 0) {
          newStack = `[baseFee]`;
        } else if (getStack.length === 1) {
          newStack = `[baseFee, ${getStack[0]}]`;
        } else {
          newStack = `[baseFee, ${getStack[0]}, ${getStack[1]}${
            getStack.length > 2 ? "," + getStack[2] : ""
          }]`;
        }
        return newStack;
      }
      case "pop": {
        let getStack = this.getStack(stack);
        let newStack;

        if (getStack.length === 0) {
          newStack = `[${getStack[0]}]`;
        } else if (getStack.length === 1) {
          newStack = `[]`;
        } else {
          newStack = `[${getStack[1]}${
            getStack.length > 2 ? "," + getStack[2] : ""
          }]`;
        }
        return newStack;
      }
      case "mload": {
        let getStack = this.getStack(stack);
        let newStack;

        if (getStack.length <= 1) {
          newStack = `[mload[${getStack[0]}]]`;
        } else {
          newStack = `[mload[${getStack[0]}], ${getStack[1]}${
            getStack.length > 2 ? "," + getStack[2] : ""
          }]`;
        }
        return newStack;
      }
      case "mstore" || "mstore8" || "sstore" || "jumpi": {
        let getStack = this.getStack(stack);
        let newStack;

        if (getStack.length < 2) {
          newStack = "[undefined]";
        } else if (getStack.length === 2) {
          newStack = `[]`;
        } else {
          newStack = `[${getStack[2].trim()}]`;
        }
        return newStack;
      }
      case "sload": {
        let getStack = this.getStack(stack);
        let newStack;

        if (getStack.length <= 1) {
          newStack = `[sload[${getStack[0]}]]`;
        } else {
          newStack = `[sload[${getStack[0]}], ${getStack[1]}${
            getStack.length > 2 ? "," + getStack[2] : ""
          }]`;
        }
        return newStack;
      }
      case "jump": {
        let getStack = this.getStack(stack);
        let newStack;

        if (getStack.length === 0) {
          newStack = `[${getStack[0]}]`;
        } else if (getStack.length === 1) {
          newStack = `[]`;
        } else {
          newStack = `[${getStack[1]}${
            getStack.length > 2 ? "," + getStack[2] : ""
          }]`;
        }
        return newStack;
      }
      case "pc": {
        let getStack = this.getStack(stack);
        let newStack;

        if (getStack.length === 0) {
          newStack = `[counter]`;
        } else if (getStack.length === 1) {
          newStack = `[counter, ${getStack[0]}]`;
        } else {
          newStack = `[counter, ${getStack[0]}, ${getStack[1]}${
            getStack.length > 2 ? "," + getStack[2] : ""
          }]`;
        }
        return newStack;
      }
      case "msize": {
        let getStack = this.getStack(stack);
        let newStack;

        if (getStack.length === 0) {
          newStack = `[msize]`;
        } else if (getStack.length === 1) {
          newStack = `[msize, ${getStack[0]}]`;
        } else {
          newStack = `[msize, ${getStack[0]}, ${getStack[1]}${
            getStack.length > 2 ? "," + getStack[2] : ""
          }]`;
        }
        return newStack;
      }
      case "gas": {
        let getStack = this.getStack(stack);
        let newStack;

        if (getStack.length === 0) {
          newStack = `[gas]`;
        } else if (getStack.length === 1) {
          newStack = `[gas, ${getStack[0]}]`;
        } else {
          newStack = `[gas, ${getStack[0]}, ${getStack[1]}${
            getStack.length > 2 ? "," + getStack[2] : ""
          }]`;
        }
        return newStack;
      }
      case "push0": {
        let getStack = this.getStack(stack);
        let newStack;

        if (getStack.length === 0) {
          newStack = `[0x00]`;
        } else if (getStack.length === 1) {
          newStack = `[0x00, ${getStack[0]}]`;
        } else {
          newStack = `[0x00, ${getStack[0]}, ${getStack[1]}${
            getStack.length > 2 ? "," + getStack[2] : ""
          }]`;
        }
        return newStack;
      }
      case "push": {
        let getStack = this.getStack(stack);
        let newStack;
        tempOpcode = tempOpcode.length > 66 ? "undefined" : tempOpcode;

        if (getStack.length === 0) {
          newStack = `[${tempOpcode}]`;
        } else if (getStack.length === 1) {
          newStack = `[${tempOpcode}, ${getStack[0]}]`;
        } else {
          newStack = `[${tempOpcode}, ${getStack[0]}, ${getStack[1]}${
            getStack.length > 2 ? "," + getStack[2] : ""
          }]`;
        }
        return newStack;
      }
      case "dup": {
        let index = parseInt(tempOpcode.slice(3)) - 1;

        let stackString = stack.slice(1, -1);
        let stackArr = stackString.split(",");
        if (index <= stackArr.length - 1) {
          return `[${stackArr[index].trim()}, ${stackString}]`;
        } else {
          return `[undefined, ${stackString}]`;
        }
      }
      case "swap": {
        let index = parseInt(tempOpcode.slice(4)); //5

        let stackString = stack.slice(1, -1);

        let stackArr = stackString.split(","); //4

        if (index < stackArr.length) {
          [stackArr[0], stackArr[index]] = [
            stackArr[index].trim(),
            ` ${stackArr[0]}`,
          ];

          return `[${stackArr.map((item) => {
            return item;
          })}]`;
        } else {
          stackArr[0] = "undefined";
          return `[${stackArr.map((item) => {
            return item;
          })}]`;
        }
      }
      default: {
        return stack;
      }
    }
  }
}
