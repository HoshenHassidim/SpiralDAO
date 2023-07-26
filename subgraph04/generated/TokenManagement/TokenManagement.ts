// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class AuthorizationGranted extends ethereum.Event {
  get params(): AuthorizationGranted__Params {
    return new AuthorizationGranted__Params(this);
  }
}

export class AuthorizationGranted__Params {
  _event: AuthorizationGranted;

  constructor(event: AuthorizationGranted) {
    this._event = event;
  }

  get account(): Address {
    return this._event.parameters[0].value.toAddress();
  }
}

export class AuthorizationRevoked extends ethereum.Event {
  get params(): AuthorizationRevoked__Params {
    return new AuthorizationRevoked__Params(this);
  }
}

export class AuthorizationRevoked__Params {
  _event: AuthorizationRevoked;

  constructor(event: AuthorizationRevoked) {
    this._event = event;
  }

  get account(): Address {
    return this._event.parameters[0].value.toAddress();
  }
}

export class ProjectTokenCreated extends ethereum.Event {
  get params(): ProjectTokenCreated__Params {
    return new ProjectTokenCreated__Params(this);
  }
}

export class ProjectTokenCreated__Params {
  _event: ProjectTokenCreated;

  constructor(event: ProjectTokenCreated) {
    this._event = event;
  }

  get projectId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get problemCreator(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get solutionCreator(): Address {
    return this._event.parameters[2].value.toAddress();
  }

  get problemCreatorProjectTokens(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }

  get problemCreatorDaoTokens(): BigInt {
    return this._event.parameters[4].value.toBigInt();
  }

  get solutionCreatorProjectTokens(): BigInt {
    return this._event.parameters[5].value.toBigInt();
  }

  get solutionCreatorDaoTokens(): BigInt {
    return this._event.parameters[6].value.toBigInt();
  }
}

export class TokensMinted extends ethereum.Event {
  get params(): TokensMinted__Params {
    return new TokensMinted__Params(this);
  }
}

export class TokensMinted__Params {
  _event: TokensMinted;

  constructor(event: TokensMinted) {
    this._event = event;
  }

  get account(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get projectId(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get projectTokens(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get daoTokens(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }
}

export class TokenManagement extends ethereum.SmartContract {
  static bind(address: Address): TokenManagement {
    return new TokenManagement("TokenManagement", address);
  }

  getAdmin(): Address {
    let result = super.call("getAdmin", "getAdmin():(address)", []);

    return result[0].toAddress();
  }

  try_getAdmin(): ethereum.CallResult<Address> {
    let result = super.tryCall("getAdmin", "getAdmin():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  getProjectToken(_projectId: BigInt): Address {
    let result = super.call(
      "getProjectToken",
      "getProjectToken(uint256):(address)",
      [ethereum.Value.fromUnsignedBigInt(_projectId)]
    );

    return result[0].toAddress();
  }

  try_getProjectToken(_projectId: BigInt): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "getProjectToken",
      "getProjectToken(uint256):(address)",
      [ethereum.Value.fromUnsignedBigInt(_projectId)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  isAuthorized(_address: Address): boolean {
    let result = super.call("isAuthorized", "isAuthorized(address):(bool)", [
      ethereum.Value.fromAddress(_address)
    ]);

    return result[0].toBoolean();
  }

  try_isAuthorized(_address: Address): ethereum.CallResult<boolean> {
    let result = super.tryCall("isAuthorized", "isAuthorized(address):(bool)", [
      ethereum.Value.fromAddress(_address)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  viewBalance(_address: Address, _projectId: BigInt): BigInt {
    let result = super.call(
      "viewBalance",
      "viewBalance(address,uint256):(uint256)",
      [
        ethereum.Value.fromAddress(_address),
        ethereum.Value.fromUnsignedBigInt(_projectId)
      ]
    );

    return result[0].toBigInt();
  }

  try_viewBalance(
    _address: Address,
    _projectId: BigInt
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "viewBalance",
      "viewBalance(address,uint256):(uint256)",
      [
        ethereum.Value.fromAddress(_address),
        ethereum.Value.fromUnsignedBigInt(_projectId)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }
}

export class ConstructorCall extends ethereum.Call {
  get inputs(): ConstructorCall__Inputs {
    return new ConstructorCall__Inputs(this);
  }

  get outputs(): ConstructorCall__Outputs {
    return new ConstructorCall__Outputs(this);
  }
}

export class ConstructorCall__Inputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class AuthorizeContractCall extends ethereum.Call {
  get inputs(): AuthorizeContractCall__Inputs {
    return new AuthorizeContractCall__Inputs(this);
  }

  get outputs(): AuthorizeContractCall__Outputs {
    return new AuthorizeContractCall__Outputs(this);
  }
}

export class AuthorizeContractCall__Inputs {
  _call: AuthorizeContractCall;

  constructor(call: AuthorizeContractCall) {
    this._call = call;
  }

  get contractAddress(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class AuthorizeContractCall__Outputs {
  _call: AuthorizeContractCall;

  constructor(call: AuthorizeContractCall) {
    this._call = call;
  }
}

export class CompleteTaskCall extends ethereum.Call {
  get inputs(): CompleteTaskCall__Inputs {
    return new CompleteTaskCall__Inputs(this);
  }

  get outputs(): CompleteTaskCall__Outputs {
    return new CompleteTaskCall__Outputs(this);
  }
}

export class CompleteTaskCall__Inputs {
  _call: CompleteTaskCall;

  constructor(call: CompleteTaskCall) {
    this._call = call;
  }

  get executor(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get manager(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get taskValue(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }

  get projectId(): BigInt {
    return this._call.inputValues[3].value.toBigInt();
  }
}

export class CompleteTaskCall__Outputs {
  _call: CompleteTaskCall;

  constructor(call: CompleteTaskCall) {
    this._call = call;
  }
}

export class NewProjectTokenCall extends ethereum.Call {
  get inputs(): NewProjectTokenCall__Inputs {
    return new NewProjectTokenCall__Inputs(this);
  }

  get outputs(): NewProjectTokenCall__Outputs {
    return new NewProjectTokenCall__Outputs(this);
  }
}

export class NewProjectTokenCall__Inputs {
  _call: NewProjectTokenCall;

  constructor(call: NewProjectTokenCall) {
    this._call = call;
  }

  get projectId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get name(): string {
    return this._call.inputValues[1].value.toString();
  }

  get symbol(): string {
    return this._call.inputValues[2].value.toString();
  }

  get problemCreator(): Address {
    return this._call.inputValues[3].value.toAddress();
  }

  get solutionCreator(): Address {
    return this._call.inputValues[4].value.toAddress();
  }
}

export class NewProjectTokenCall__Outputs {
  _call: NewProjectTokenCall;

  constructor(call: NewProjectTokenCall) {
    this._call = call;
  }
}

export class RevokeContractAuthorizationCall extends ethereum.Call {
  get inputs(): RevokeContractAuthorizationCall__Inputs {
    return new RevokeContractAuthorizationCall__Inputs(this);
  }

  get outputs(): RevokeContractAuthorizationCall__Outputs {
    return new RevokeContractAuthorizationCall__Outputs(this);
  }
}

export class RevokeContractAuthorizationCall__Inputs {
  _call: RevokeContractAuthorizationCall;

  constructor(call: RevokeContractAuthorizationCall) {
    this._call = call;
  }

  get contractAddress(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class RevokeContractAuthorizationCall__Outputs {
  _call: RevokeContractAuthorizationCall;

  constructor(call: RevokeContractAuthorizationCall) {
    this._call = call;
  }
}
