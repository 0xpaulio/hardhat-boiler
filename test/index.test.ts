import { expect } from "chai";
import { ethers } from "hardhat";
import {
  Greeter,
  Greeter__factory
} from "../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

describe("Greeter", function () {
  let deployer: SignerWithAddress;
  let vault: SignerWithAddress;
  let president: SignerWithAddress;

  let alice: SignerWithAddress;
  let bob: SignerWithAddress;


  let greeter: Greeter;

  before(async function () {
    // Initialize accounts
    [deployer, vault, president, alice, bob] = await ethers.getSigners();
  });

  beforeEach(async function () {
    greeter = await (new Greeter__factory(deployer)).deploy("Hello, world!");
  });

  it("Should return the new greeting once it's changed", async function () {
    expect(await greeter.greet()).to.equal("Hello, world!");

    const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // wait until the transaction is mined
    await setGreetingTx.wait();

    expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});
