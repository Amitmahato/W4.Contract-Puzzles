const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { assert } = require("chai");

describe("Game4", function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory("Game4");
    const game = await Game.deploy();

    const signer0 = ethers.provider.getSigner(0);
    const signer1 = ethers.provider.getSigner(1);

    return { game, signer0, signer1 };
  }
  it("should be a winner", async function () {
    const { game, signer0, signer1 } = await loadFixture(
      deployContractAndSetVariables
    );

    // nested mappings are rough :}
    await game.connect(signer1).write(signer0.getAddress());

    await game.connect(signer0).win(signer1.getAddress());

    // leave this assertion as-is
    assert(await game.isWon(), "You did not win the game");
  });
});
