import { Notification } from "@puremvc/puremvc-js-multicore-framework";
import { AsyncCommand } from "../src/index.js";

class AsyncCommandTestVO {
  constructor(input) {
    this.input = input;
    this.result = 0;
  }
}

describe("AsyncCommandTest", () => {
  test("testAsyncCommandExecute", () => {
    class AsyncCommandTestCommand extends AsyncCommand {
      execute(notification) {
        const vo = notification.body;
        vo.result = vo.input * vo.input;
      }
    }

    // Create the VO
    const vo = new AsyncCommandTestVO(5);

    // Create the Notification (note)
    const notification = new Notification("AsyncCommandTestNote", vo);

    // Create the AsyncCommand
    const command = new AsyncCommandTestCommand();

    // Execute the AsyncCommand
    command.execute(notification);

    // test assertions
    expect(vo.result).toBe(25);
  });
});
