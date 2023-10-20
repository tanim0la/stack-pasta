// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { Opcode } from "./opcodes";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "stack-pasta" is now active!');

  const opcode = new Opcode();

  let prevLineCount: number = vscode.window.activeTextEditor
    ? vscode.window.activeTextEditor.document.lineCount
    : 0;

  vscode.window.onDidChangeActiveTextEditor((editor) => {
    if (editor) {
      prevLineCount = editor.document.lineCount;
    }
  });

  vscode.window.onDidChangeTextEditorSelection(async (onChange) => {
    const editor = onChange.textEditor;
    const document = onChange.textEditor.document;
    const documentExt = document.uri.toString().slice(-5);

    if (prevLineCount > document.lineCount) {
      prevLineCount = document.lineCount;
    }

    if (
      onChange.kind === undefined &&
      documentExt === ".huff" &&
      prevLineCount < document.lineCount
    ) {
      // The primary selection on the text editor
      const selection = editor.selection;

      // Get the position of the cursor
      let cursorIndex: number = selection.anchor.line - 1;

      // Get the text on the cursor index
      let lineAt = document.lineAt(cursorIndex);
      let cursorIndexText: string = lineAt.text;
      let lineArr: string[] = cursorIndexText.toString().split("//");
      let filteredStack: string[] = opcode.filterStack(lineArr);

      if (
        filteredStack.length === 1 &&
        !cursorIndexText.includes(":") &&
        !cursorIndexText.includes("//") &&
        !cursorIndexText.includes("#define") &&
        !cursorIndexText.includes("}")
      ) {
        let isDone: boolean = false;
        let seenPrevStack: boolean = false;
        let commentIndexStart: number = 0;
        let prevStackComment: string = "";

        for (let i = cursorIndex - 1; i >= 0; i--) {
          let prevText: string = document.lineAt(i).text;
          let prevTextArr: string[] = prevText.toString().split("//");

          let filterPrevTextArr: string[] = opcode.filterStack(prevTextArr);

          if (
            filterPrevTextArr.length === 2 &&
            filterPrevTextArr[0].trim().split(" ").length === 1
          ) {
            prevStackComment = filterPrevTextArr[1];
            commentIndexStart = prevText.toString().indexOf("//");
            seenPrevStack = true;
            isDone = true;
          } else {
            for (let item of filterPrevTextArr) {
              if (
                item.includes("#define") ||
                item.includes("{") ||
                item.includes("}")
              ) {
                isDone = true;
              }
            }
          }

          if (isDone) {
            break;
          }
        }

        if (
          seenPrevStack &&
          prevStackComment.includes("[") &&
          prevStackComment.includes("]")
        ) {
          let stack: string = `// ${opcode.execute(
            filteredStack[0],
            prevStackComment,
          )}`;

          let padding =
            commentIndexStart + stack.length - lineAt.range.end.character;

          stack = stack.padStart(padding, " ");

          editor.edit((editBuilder) => {
            editBuilder.insert(
              new vscode.Position(
                cursorIndex,
                commentIndexStart + (stack.length - padding),
              ),
              stack,
            );
          });
        }
      }

      prevLineCount = editor.document.lineCount;
    }
  });
}

// This method is called when your extension is deactivated
export function deactivate() {}
