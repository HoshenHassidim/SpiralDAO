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

export class NewOffer extends ethereum.Event {
  get params(): NewOffer__Params {
    return new NewOffer__Params(this);
  }
}

export class NewOffer__Params {
  _event: NewOffer;

  constructor(event: NewOffer) {
    this._event = event;
  }

  get offerId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get projectId(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get proposer(): Address {
    return this._event.parameters[2].value.toAddress();
  }
}

export class NewProject extends ethereum.Event {
  get params(): NewProject__Params {
    return new NewProject__Params(this);
  }
}

export class NewProject__Params {
  _event: NewProject;

  constructor(event: NewProject) {
    this._event = event;
  }

  get projectId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }
}

export class OfferCancelled extends ethereum.Event {
  get params(): OfferCancelled__Params {
    return new OfferCancelled__Params(this);
  }
}

export class OfferCancelled__Params {
  _event: OfferCancelled;

  constructor(event: OfferCancelled) {
    this._event = event;
  }

  get offerId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }
}

export class OfferRated extends ethereum.Event {
  get params(): OfferRated__Params {
    return new OfferRated__Params(this);
  }
}

export class OfferRated__Params {
  _event: OfferRated;

  constructor(event: OfferRated) {
    this._event = event;
  }

  get offerId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get voter(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get rating(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class ProjectManagerAssigned extends ethereum.Event {
  get params(): ProjectManagerAssigned__Params {
    return new ProjectManagerAssigned__Params(this);
  }
}

export class ProjectManagerAssigned__Params {
  _event: ProjectManagerAssigned;

  constructor(event: ProjectManagerAssigned) {
    this._event = event;
  }

  get projectId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get projectManager(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class Projects__viewOfferDetailsResult {
  value0: BigInt;
  value1: BigInt;
  value2: Address;
  value3: BigInt;
  value4: BigInt;
  value5: boolean;

  constructor(
    value0: BigInt,
    value1: BigInt,
    value2: Address,
    value3: BigInt,
    value4: BigInt,
    value5: boolean
  ) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
    this.value3 = value3;
    this.value4 = value4;
    this.value5 = value5;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromUnsignedBigInt(this.value0));
    map.set("value1", ethereum.Value.fromUnsignedBigInt(this.value1));
    map.set("value2", ethereum.Value.fromAddress(this.value2));
    map.set("value3", ethereum.Value.fromUnsignedBigInt(this.value3));
    map.set("value4", ethereum.Value.fromUnsignedBigInt(this.value4));
    map.set("value5", ethereum.Value.fromBoolean(this.value5));
    return map;
  }

  getValue0(): BigInt {
    return this.value0;
  }

  getValue1(): BigInt {
    return this.value1;
  }

  getValue2(): Address {
    return this.value2;
  }

  getValue3(): BigInt {
    return this.value3;
  }

  getValue4(): BigInt {
    return this.value4;
  }

  getValue5(): boolean {
    return this.value5;
  }
}

export class Projects__viewProjectDetailsResult {
  value0: BigInt;
  value1: boolean;

  constructor(value0: BigInt, value1: boolean) {
    this.value0 = value0;
    this.value1 = value1;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromUnsignedBigInt(this.value0));
    map.set("value1", ethereum.Value.fromBoolean(this.value1));
    return map;
  }

  getValue0(): BigInt {
    return this.value0;
  }

  getValue1(): boolean {
    return this.value1;
  }
}

export class Projects extends ethereum.SmartContract {
  static bind(address: Address): Projects {
    return new Projects("Projects", address);
  }

  getOfferCounter(): BigInt {
    let result = super.call(
      "getOfferCounter",
      "getOfferCounter():(uint256)",
      []
    );

    return result[0].toBigInt();
  }

  try_getOfferCounter(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getOfferCounter",
      "getOfferCounter():(uint256)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getProjectManager(_projectId: BigInt): Address {
    let result = super.call(
      "getProjectManager",
      "getProjectManager(uint256):(address)",
      [ethereum.Value.fromUnsignedBigInt(_projectId)]
    );

    return result[0].toAddress();
  }

  try_getProjectManager(_projectId: BigInt): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "getProjectManager",
      "getProjectManager(uint256):(address)",
      [ethereum.Value.fromUnsignedBigInt(_projectId)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  viewOfferDetails(_offerId: BigInt): Projects__viewOfferDetailsResult {
    let result = super.call(
      "viewOfferDetails",
      "viewOfferDetails(uint256):(uint256,uint256,address,uint256,uint256,bool)",
      [ethereum.Value.fromUnsignedBigInt(_offerId)]
    );

    return new Projects__viewOfferDetailsResult(
      result[0].toBigInt(),
      result[1].toBigInt(),
      result[2].toAddress(),
      result[3].toBigInt(),
      result[4].toBigInt(),
      result[5].toBoolean()
    );
  }

  try_viewOfferDetails(
    _offerId: BigInt
  ): ethereum.CallResult<Projects__viewOfferDetailsResult> {
    let result = super.tryCall(
      "viewOfferDetails",
      "viewOfferDetails(uint256):(uint256,uint256,address,uint256,uint256,bool)",
      [ethereum.Value.fromUnsignedBigInt(_offerId)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new Projects__viewOfferDetailsResult(
        value[0].toBigInt(),
        value[1].toBigInt(),
        value[2].toAddress(),
        value[3].toBigInt(),
        value[4].toBigInt(),
        value[5].toBoolean()
      )
    );
  }

  viewProjectDetails(_projectId: BigInt): Projects__viewProjectDetailsResult {
    let result = super.call(
      "viewProjectDetails",
      "viewProjectDetails(uint256):(uint256,bool)",
      [ethereum.Value.fromUnsignedBigInt(_projectId)]
    );

    return new Projects__viewProjectDetailsResult(
      result[0].toBigInt(),
      result[1].toBoolean()
    );
  }

  try_viewProjectDetails(
    _projectId: BigInt
  ): ethereum.CallResult<Projects__viewProjectDetailsResult> {
    let result = super.tryCall(
      "viewProjectDetails",
      "viewProjectDetails(uint256):(uint256,bool)",
      [ethereum.Value.fromUnsignedBigInt(_projectId)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new Projects__viewProjectDetailsResult(
        value[0].toBigInt(),
        value[1].toBoolean()
      )
    );
  }

  viewProjectOffers(_projectId: BigInt): Array<BigInt> {
    let result = super.call(
      "viewProjectOffers",
      "viewProjectOffers(uint256):(uint256[])",
      [ethereum.Value.fromUnsignedBigInt(_projectId)]
    );

    return result[0].toBigIntArray();
  }

  try_viewProjectOffers(
    _projectId: BigInt
  ): ethereum.CallResult<Array<BigInt>> {
    let result = super.tryCall(
      "viewProjectOffers",
      "viewProjectOffers(uint256):(uint256[])",
      [ethereum.Value.fromUnsignedBigInt(_projectId)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigIntArray());
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

  get _membershipContract(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _solutionsContract(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get _tokenManagementContract(): Address {
    return this._call.inputValues[2].value.toAddress();
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class AssignProjectManagerCall extends ethereum.Call {
  get inputs(): AssignProjectManagerCall__Inputs {
    return new AssignProjectManagerCall__Inputs(this);
  }

  get outputs(): AssignProjectManagerCall__Outputs {
    return new AssignProjectManagerCall__Outputs(this);
  }
}

export class AssignProjectManagerCall__Inputs {
  _call: AssignProjectManagerCall;

  constructor(call: AssignProjectManagerCall) {
    this._call = call;
  }

  get _projectId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class AssignProjectManagerCall__Outputs {
  _call: AssignProjectManagerCall;

  constructor(call: AssignProjectManagerCall) {
    this._call = call;
  }
}

export class CancelOfferCall extends ethereum.Call {
  get inputs(): CancelOfferCall__Inputs {
    return new CancelOfferCall__Inputs(this);
  }

  get outputs(): CancelOfferCall__Outputs {
    return new CancelOfferCall__Outputs(this);
  }
}

export class CancelOfferCall__Inputs {
  _call: CancelOfferCall;

  constructor(call: CancelOfferCall) {
    this._call = call;
  }

  get _offerId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class CancelOfferCall__Outputs {
  _call: CancelOfferCall;

  constructor(call: CancelOfferCall) {
    this._call = call;
  }
}

export class ProposeOfferCall extends ethereum.Call {
  get inputs(): ProposeOfferCall__Inputs {
    return new ProposeOfferCall__Inputs(this);
  }

  get outputs(): ProposeOfferCall__Outputs {
    return new ProposeOfferCall__Outputs(this);
  }
}

export class ProposeOfferCall__Inputs {
  _call: ProposeOfferCall;

  constructor(call: ProposeOfferCall) {
    this._call = call;
  }

  get _solutionId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class ProposeOfferCall__Outputs {
  _call: ProposeOfferCall;

  constructor(call: ProposeOfferCall) {
    this._call = call;
  }
}

export class RateOfferCall extends ethereum.Call {
  get inputs(): RateOfferCall__Inputs {
    return new RateOfferCall__Inputs(this);
  }

  get outputs(): RateOfferCall__Outputs {
    return new RateOfferCall__Outputs(this);
  }
}

export class RateOfferCall__Inputs {
  _call: RateOfferCall;

  constructor(call: RateOfferCall) {
    this._call = call;
  }

  get _offerId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get _rating(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class RateOfferCall__Outputs {
  _call: RateOfferCall;

  constructor(call: RateOfferCall) {
    this._call = call;
  }
}
