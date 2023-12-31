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

export class ManagementOfferCancelled extends ethereum.Event {
  get params(): ManagementOfferCancelled__Params {
    return new ManagementOfferCancelled__Params(this);
  }
}

export class ManagementOfferCancelled__Params {
  _event: ManagementOfferCancelled;

  constructor(event: ManagementOfferCancelled) {
    this._event = event;
  }

  get offerId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }
}

export class ManagementOfferRated extends ethereum.Event {
  get params(): ManagementOfferRated__Params {
    return new ManagementOfferRated__Params(this);
  }
}

export class ManagementOfferRated__Params {
  _event: ManagementOfferRated;

  constructor(event: ManagementOfferRated) {
    this._event = event;
  }

  get offerId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get rater(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get rating(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class NewManagementOffer extends ethereum.Event {
  get params(): NewManagementOffer__Params {
    return new NewManagementOffer__Params(this);
  }
}

export class NewManagementOffer__Params {
  _event: NewManagementOffer;

  constructor(event: NewManagementOffer) {
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

export class NewProjectManagerRemovalOffer extends ethereum.Event {
  get params(): NewProjectManagerRemovalOffer__Params {
    return new NewProjectManagerRemovalOffer__Params(this);
  }
}

export class NewProjectManagerRemovalOffer__Params {
  _event: NewProjectManagerRemovalOffer;

  constructor(event: NewProjectManagerRemovalOffer) {
    this._event = event;
  }

  get removalOfferId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get projectId(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get proposer(): Address {
    return this._event.parameters[2].value.toAddress();
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

export class ProjectManagerRemovalOfferCancelled extends ethereum.Event {
  get params(): ProjectManagerRemovalOfferCancelled__Params {
    return new ProjectManagerRemovalOfferCancelled__Params(this);
  }
}

export class ProjectManagerRemovalOfferCancelled__Params {
  _event: ProjectManagerRemovalOfferCancelled;

  constructor(event: ProjectManagerRemovalOfferCancelled) {
    this._event = event;
  }

  get removalOfferId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }
}

export class ProjectManagerRemovalOfferRated extends ethereum.Event {
  get params(): ProjectManagerRemovalOfferRated__Params {
    return new ProjectManagerRemovalOfferRated__Params(this);
  }
}

export class ProjectManagerRemovalOfferRated__Params {
  _event: ProjectManagerRemovalOfferRated;

  constructor(event: ProjectManagerRemovalOfferRated) {
    this._event = event;
  }

  get removalOfferId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get rater(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get rating(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class ProjectManagerResigned extends ethereum.Event {
  get params(): ProjectManagerResigned__Params {
    return new ProjectManagerResigned__Params(this);
  }
}

export class ProjectManagerResigned__Params {
  _event: ProjectManagerResigned;

  constructor(event: ProjectManagerResigned) {
    this._event = event;
  }

  get projectId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }
}

export class ProjectManagerVotedOut extends ethereum.Event {
  get params(): ProjectManagerVotedOut__Params {
    return new ProjectManagerVotedOut__Params(this);
  }
}

export class ProjectManagerVotedOut__Params {
  _event: ProjectManagerVotedOut;

  constructor(event: ProjectManagerVotedOut) {
    this._event = event;
  }

  get removalOfferId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get projectId(): BigInt {
    return this._event.parameters[1].value.toBigInt();
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
  value2: boolean;

  constructor(value0: BigInt, value1: boolean, value2: boolean) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromUnsignedBigInt(this.value0));
    map.set("value1", ethereum.Value.fromBoolean(this.value1));
    map.set("value2", ethereum.Value.fromBoolean(this.value2));
    return map;
  }

  getValue0(): BigInt {
    return this.value0;
  }

  getValue1(): boolean {
    return this.value1;
  }

  getValue2(): boolean {
    return this.value2;
  }
}

export class Projects__viewRemovalOfferDetailsResult {
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

export class Projects extends ethereum.SmartContract {
  static bind(address: Address): Projects {
    return new Projects("Projects", address);
  }

  doesProjectExist(projectId: BigInt): boolean {
    let result = super.call(
      "doesProjectExist",
      "doesProjectExist(uint256):(bool)",
      [ethereum.Value.fromUnsignedBigInt(projectId)]
    );

    return result[0].toBoolean();
  }

  try_doesProjectExist(projectId: BigInt): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "doesProjectExist",
      "doesProjectExist(uint256):(bool)",
      [ethereum.Value.fromUnsignedBigInt(projectId)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  doesProjectHaveManager(projectId: BigInt): boolean {
    let result = super.call(
      "doesProjectHaveManager",
      "doesProjectHaveManager(uint256):(bool)",
      [ethereum.Value.fromUnsignedBigInt(projectId)]
    );

    return result[0].toBoolean();
  }

  try_doesProjectHaveManager(projectId: BigInt): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "doesProjectHaveManager",
      "doesProjectHaveManager(uint256):(bool)",
      [ethereum.Value.fromUnsignedBigInt(projectId)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  getManagementOfferCounter(): BigInt {
    let result = super.call(
      "getManagementOfferCounter",
      "getManagementOfferCounter():(uint256)",
      []
    );

    return result[0].toBigInt();
  }

  try_getManagementOfferCounter(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getManagementOfferCounter",
      "getManagementOfferCounter():(uint256)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getManagementRemovalOfferCounter(): BigInt {
    let result = super.call(
      "getManagementRemovalOfferCounter",
      "getManagementRemovalOfferCounter():(uint256)",
      []
    );

    return result[0].toBigInt();
  }

  try_getManagementRemovalOfferCounter(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getManagementRemovalOfferCounter",
      "getManagementRemovalOfferCounter():(uint256)",
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

  projectCounter(): BigInt {
    let result = super.call("projectCounter", "projectCounter():(uint256)", []);

    return result[0].toBigInt();
  }

  try_projectCounter(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "projectCounter",
      "projectCounter():(uint256)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
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
      "viewProjectDetails(uint256):(uint256,bool,bool)",
      [ethereum.Value.fromUnsignedBigInt(_projectId)]
    );

    return new Projects__viewProjectDetailsResult(
      result[0].toBigInt(),
      result[1].toBoolean(),
      result[2].toBoolean()
    );
  }

  try_viewProjectDetails(
    _projectId: BigInt
  ): ethereum.CallResult<Projects__viewProjectDetailsResult> {
    let result = super.tryCall(
      "viewProjectDetails",
      "viewProjectDetails(uint256):(uint256,bool,bool)",
      [ethereum.Value.fromUnsignedBigInt(_projectId)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new Projects__viewProjectDetailsResult(
        value[0].toBigInt(),
        value[1].toBoolean(),
        value[2].toBoolean()
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

  viewRemovalOfferDetails(
    _removalOfferId: BigInt
  ): Projects__viewRemovalOfferDetailsResult {
    let result = super.call(
      "viewRemovalOfferDetails",
      "viewRemovalOfferDetails(uint256):(uint256,uint256,address,uint256,uint256,bool)",
      [ethereum.Value.fromUnsignedBigInt(_removalOfferId)]
    );

    return new Projects__viewRemovalOfferDetailsResult(
      result[0].toBigInt(),
      result[1].toBigInt(),
      result[2].toAddress(),
      result[3].toBigInt(),
      result[4].toBigInt(),
      result[5].toBoolean()
    );
  }

  try_viewRemovalOfferDetails(
    _removalOfferId: BigInt
  ): ethereum.CallResult<Projects__viewRemovalOfferDetailsResult> {
    let result = super.tryCall(
      "viewRemovalOfferDetails",
      "viewRemovalOfferDetails(uint256):(uint256,uint256,address,uint256,uint256,bool)",
      [ethereum.Value.fromUnsignedBigInt(_removalOfferId)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new Projects__viewRemovalOfferDetailsResult(
        value[0].toBigInt(),
        value[1].toBigInt(),
        value[2].toAddress(),
        value[3].toBigInt(),
        value[4].toBigInt(),
        value[5].toBoolean()
      )
    );
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

  get _authorizationManagementContract(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get _solutionsContract(): Address {
    return this._call.inputValues[2].value.toAddress();
  }

  get _tokenManagementContract(): Address {
    return this._call.inputValues[3].value.toAddress();
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

export class CancelManagementOfferCall extends ethereum.Call {
  get inputs(): CancelManagementOfferCall__Inputs {
    return new CancelManagementOfferCall__Inputs(this);
  }

  get outputs(): CancelManagementOfferCall__Outputs {
    return new CancelManagementOfferCall__Outputs(this);
  }
}

export class CancelManagementOfferCall__Inputs {
  _call: CancelManagementOfferCall;

  constructor(call: CancelManagementOfferCall) {
    this._call = call;
  }

  get _offerId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class CancelManagementOfferCall__Outputs {
  _call: CancelManagementOfferCall;

  constructor(call: CancelManagementOfferCall) {
    this._call = call;
  }
}

export class CancelRemovalOfferCall extends ethereum.Call {
  get inputs(): CancelRemovalOfferCall__Inputs {
    return new CancelRemovalOfferCall__Inputs(this);
  }

  get outputs(): CancelRemovalOfferCall__Outputs {
    return new CancelRemovalOfferCall__Outputs(this);
  }
}

export class CancelRemovalOfferCall__Inputs {
  _call: CancelRemovalOfferCall;

  constructor(call: CancelRemovalOfferCall) {
    this._call = call;
  }

  get _removalOfferId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class CancelRemovalOfferCall__Outputs {
  _call: CancelRemovalOfferCall;

  constructor(call: CancelRemovalOfferCall) {
    this._call = call;
  }
}

export class CheckRemovalRatingsCall extends ethereum.Call {
  get inputs(): CheckRemovalRatingsCall__Inputs {
    return new CheckRemovalRatingsCall__Inputs(this);
  }

  get outputs(): CheckRemovalRatingsCall__Outputs {
    return new CheckRemovalRatingsCall__Outputs(this);
  }
}

export class CheckRemovalRatingsCall__Inputs {
  _call: CheckRemovalRatingsCall;

  constructor(call: CheckRemovalRatingsCall) {
    this._call = call;
  }

  get _removalOfferId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class CheckRemovalRatingsCall__Outputs {
  _call: CheckRemovalRatingsCall;

  constructor(call: CheckRemovalRatingsCall) {
    this._call = call;
  }
}

export class ManagerResignCall extends ethereum.Call {
  get inputs(): ManagerResignCall__Inputs {
    return new ManagerResignCall__Inputs(this);
  }

  get outputs(): ManagerResignCall__Outputs {
    return new ManagerResignCall__Outputs(this);
  }
}

export class ManagerResignCall__Inputs {
  _call: ManagerResignCall;

  constructor(call: ManagerResignCall) {
    this._call = call;
  }

  get _projectId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class ManagerResignCall__Outputs {
  _call: ManagerResignCall;

  constructor(call: ManagerResignCall) {
    this._call = call;
  }
}

export class ProposeManagementOfferCall extends ethereum.Call {
  get inputs(): ProposeManagementOfferCall__Inputs {
    return new ProposeManagementOfferCall__Inputs(this);
  }

  get outputs(): ProposeManagementOfferCall__Outputs {
    return new ProposeManagementOfferCall__Outputs(this);
  }
}

export class ProposeManagementOfferCall__Inputs {
  _call: ProposeManagementOfferCall;

  constructor(call: ProposeManagementOfferCall) {
    this._call = call;
  }

  get _solutionId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class ProposeManagementOfferCall__Outputs {
  _call: ProposeManagementOfferCall;

  constructor(call: ProposeManagementOfferCall) {
    this._call = call;
  }
}

export class ProposeManagementOfferDAOCall extends ethereum.Call {
  get inputs(): ProposeManagementOfferDAOCall__Inputs {
    return new ProposeManagementOfferDAOCall__Inputs(this);
  }

  get outputs(): ProposeManagementOfferDAOCall__Outputs {
    return new ProposeManagementOfferDAOCall__Outputs(this);
  }
}

export class ProposeManagementOfferDAOCall__Inputs {
  _call: ProposeManagementOfferDAOCall;

  constructor(call: ProposeManagementOfferDAOCall) {
    this._call = call;
  }
}

export class ProposeManagementOfferDAOCall__Outputs {
  _call: ProposeManagementOfferDAOCall;

  constructor(call: ProposeManagementOfferDAOCall) {
    this._call = call;
  }
}

export class ProposeRemoveManagerCall extends ethereum.Call {
  get inputs(): ProposeRemoveManagerCall__Inputs {
    return new ProposeRemoveManagerCall__Inputs(this);
  }

  get outputs(): ProposeRemoveManagerCall__Outputs {
    return new ProposeRemoveManagerCall__Outputs(this);
  }
}

export class ProposeRemoveManagerCall__Inputs {
  _call: ProposeRemoveManagerCall;

  constructor(call: ProposeRemoveManagerCall) {
    this._call = call;
  }

  get _projectId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class ProposeRemoveManagerCall__Outputs {
  _call: ProposeRemoveManagerCall;

  constructor(call: ProposeRemoveManagerCall) {
    this._call = call;
  }
}

export class RateRemovalOfferCall extends ethereum.Call {
  get inputs(): RateRemovalOfferCall__Inputs {
    return new RateRemovalOfferCall__Inputs(this);
  }

  get outputs(): RateRemovalOfferCall__Outputs {
    return new RateRemovalOfferCall__Outputs(this);
  }
}

export class RateRemovalOfferCall__Inputs {
  _call: RateRemovalOfferCall;

  constructor(call: RateRemovalOfferCall) {
    this._call = call;
  }

  get _removalOfferId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get _rating(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class RateRemovalOfferCall__Outputs {
  _call: RateRemovalOfferCall;

  constructor(call: RateRemovalOfferCall) {
    this._call = call;
  }
}

export class RatelManagementOfferCall extends ethereum.Call {
  get inputs(): RatelManagementOfferCall__Inputs {
    return new RatelManagementOfferCall__Inputs(this);
  }

  get outputs(): RatelManagementOfferCall__Outputs {
    return new RatelManagementOfferCall__Outputs(this);
  }
}

export class RatelManagementOfferCall__Inputs {
  _call: RatelManagementOfferCall;

  constructor(call: RatelManagementOfferCall) {
    this._call = call;
  }

  get _offerId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get _rating(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class RatelManagementOfferCall__Outputs {
  _call: RatelManagementOfferCall;

  constructor(call: RatelManagementOfferCall) {
    this._call = call;
  }
}
