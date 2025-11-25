import { Notification } from "@puremvc/puremvc-js-multicore-framework";
import { AsyncMacroCommand, AsyncCommand } from "../src/index.js";

class AsyncCommandTestVO {
  constructor(input) {
    this.input = input;
    this.result = 0;
  }
}

describe("AsyncMacroCommandTest", () => {
  test("testExecuteWithSubCommands", (done) => {
    class TestAsyncCommand1 extends AsyncCommand {
      execute(note) {
        setTimeout(() => {
          const vo = note.body;
          vo.result = vo.input * 2;
          this.commandComplete();
        }, 100);
      }
    }

    class TestAsyncCommand2 extends AsyncCommand {
      execute(note) {
        setTimeout(() => {
          const vo = note.body;
          vo.result = vo.result * 2;
          this.commandComplete();
        }, 100);
      }
    }

    class TestAsyncMacroCommand extends AsyncMacroCommand {
      initializeAsyncMacroCommand() {
        this.addSubCommand(() => new TestAsyncCommand1());
        this.addSubCommand(() => new TestAsyncCommand2());
      }
    }

    const vo = new AsyncCommandTestVO(5);
    const asyncMacroCommand = new TestAsyncMacroCommand();
    const notification = new Notification("TestNotification", vo);
    asyncMacroCommand.execute(notification);
    setTimeout(() => {
      expect(vo.input).toEqual(5);
      expect(vo.result).toEqual(20);
      done();
    }, 500);
  });

  test("testSetOnComplete", (done) => {
    class TestAsyncCommand1 extends AsyncCommand {
      execute(note) {
        setTimeout(() => {
          const vo = note.body;
          vo.result = vo.input * vo.input;
          this.commandComplete();
        }, 100);
      }
    }

    class TestAsyncCommand2 extends AsyncCommand {
      execute(note) {
        setTimeout(() => {
          const vo = note.body;
          vo.result = vo.result * vo.input;
          this.commandComplete();
        }, 100);
      }
    }

    class TestAsyncMacroCommand extends AsyncMacroCommand {
      initializeAsyncMacroCommand() {
        this.addSubCommand(() => new TestAsyncCommand1());
        this.addSubCommand(() => new TestAsyncCommand2());
      }
      execute(notification) {
        this.setOnComplete(() => {
          const vo = notification.body;
          vo.result = vo.result * vo.input;
        });
        super.execute(notification);
      }
    }

    const vo = new AsyncCommandTestVO(5);
    const asyncMacroCommand = new TestAsyncMacroCommand();
    const notification = new Notification("TestNotification", vo);
    asyncMacroCommand.execute(notification);
    setTimeout(() => {
      expect(vo.input).toEqual(5);
      expect(vo.result).toEqual(625);
      done();
    }, 700);
  });
});
