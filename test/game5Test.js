const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { assert } = require("chai");

describe("Game5", function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory("Game5");
    const game = await Game.deploy();
    const threshold = "0x00FfFFfFFFfFFFFFfFfFfffFFFfffFfFffFfFFFf";

    let winningSigner, winningSignerAddress;
    while (true) {
      const signer = ethers.Wallet.createRandom().connect(ethers.provider);
      const address = await signer.getAddress();
      if (address < threshold) {
        winningSigner = signer;
        winningSignerAddress = address;
        break;
      }
    }

    return { game, winningSigner, winningSignerAddress };
  }
  it("should be a winner", async function () {
    const { game, winningSigner, winningSignerAddress } = await loadFixture(
      deployContractAndSetVariables
    );

    // Since the winning signer was randomly generated
    // there is zero ether, so let us transfer some ether from signer at 0 index
    const signer = ethers.provider.getSigner();
    await signer.sendTransaction({
      to: winningSignerAddress,
      value: ethers.utils.parseEther("1"),
    });

    // after the winningSigner has some ether
    // we can use winningSigner to trigger win function
    await game.connect(winningSigner).win();

    // leave this assertion as-is
    assert(await game.isWon(), "You did not win the game");
  });
});
