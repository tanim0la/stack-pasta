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
      let cursorIndex = selection.anchor.line;

      // Get the text on the cursor index
      let cursorIndexText = document.lineAt(
        cursorIndex > 0 ? cursorIndex - 1 : cursorIndex,
      ).text;

      let commentIndexStart: number = cursorIndexText.toString().indexOf("//");
      let commentIndexEnd: number = cursorIndexText.toString().indexOf("]");
      let lineArr = cursorIndexText.toString().split("//");
      let firstItem = lineArr[0].trim().split(" ");

      if (
        lineArr.length === 2 &&
        firstItem.length === 1 &&
        firstItem[0] !== ""
      ) {
        let stack: string = opcode.execute(firstItem[0], lineArr[1].trim());
        // console.log(commentIndexStart);
        // console.log(commentIndexEnd);

        editor.edit((editBuilder) => {
          editBuilder.delete(
            new vscode.Range(
              new vscode.Position(cursorIndex - 1, commentIndexStart),
              new vscode.Position(cursorIndex - 1, commentIndexEnd + 1),
            ),
          );

          editBuilder.replace(
            new vscode.Position(cursorIndex - 1, commentIndexStart),
            `// ${stack}`,
          );

          editBuilder.insert(selection.active, `    // ${stack}`);

          vscode.window.showTextDocument(document).then((editor) => {
            editor.selection = new vscode.Selection(
              new vscode.Position(
                selection.active.line,
                selection.active.character,
              ),
              new vscode.Position(
                selection.active.line,
                selection.active.character,
              ),
            );

            editor.revealRange(
              editor.selection,
              vscode.TextEditorRevealType.Default,
            );
          });
        });
      }
      prevLineCount = editor.document.lineCount;
    }
  });
}

// This method is called when your extension is deactivated
export function deactivate() {}
