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

export class AdminChanged extends ethereum.Event {
  get params(): AdminChanged__Params {
    return new AdminChanged__Params(this);
  }
}

export class AdminChanged__Params {
  _event: AdminChanged;

  constructor(event: AdminChanged) {
    this._event = event;
  }

  get newAdmin(): Address {
    return this._event.parameters[0].value.toAddress();
  }
}

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

export class AuthorizationManagement extends ethereum.SmartContract {
  static bind(address: Address): AuthorizationManagement {
    return new AuthorizationManagement("AuthorizationManagement", address);
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

  getAuthorizedContractsCount(): BigInt {
    let result = super.call(
      "getAuthorizedContractsCount",
      "getAuthorizedContractsCount():(uint256)",
      []
    );

    return result[0].toBigInt();
  }

  try_getAuthorizedContractsCount(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getAuthorizedContractsCount",
      "getAuthorizedContractsCount():(uint256)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
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

export class ChangeAdminCall extends ethereum.Call {
  get inputs(): ChangeAdminCall__Inputs {
    return new ChangeAdminCall__Inputs(this);
  }

  get outputs(): ChangeAdminCall__Outputs {
    return new ChangeAdminCall__Outputs(this);
  }
}

export class ChangeAdminCall__Inputs {
  _call: ChangeAdminCall;

  constructor(call: ChangeAdminCall) {
    this._call = call;
  }

  get newAdmin(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class ChangeAdminCall__Outputs {
  _call: ChangeAdminCall;

  constructor(call: ChangeAdminCall) {
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