pragma solidity ^0.4.24;


contract UIExtension {
  string public uiExtensionVersion = "0.0.1";
  
  uint256 constant INTEGER = 1;
  uint256 constant FLOAT = 2;
  uint256 constant ADDRESS = 3;
  uint256 constant BOOL = 4;
  uint256 constant DATE = 5;
  uint256 constant STRING = 6;
  uint256 constant BYTE = 7;
  uint256 constant SMARTACCOUNTADDRESS = 8; //used to inform that the respective smart account should be inputted on the parameter
  uint256 constant IDENTIFIER = 9; //used to inform that the respective smart account identifier should be inputted on the parameter
  
  struct Parameter {
    bool isArray;
    bool isOptional;
    uint256 typeReference;
    uint256 decimals; //only for INTEGER and FLOAT types (the value that will be multiplied, default 1, not defined or zero is equal 1 too)
    string description;
  }

  struct ConfigParameter {
    bool isEditable;
    Parameter parameter;
  }
  
  struct Setup {
    bytes4 createFunctionSignature; //function signature to create new configurable instance (view notes below)
    bytes4 updateFunctionSignature; //function signature to update existing configurable instance (view notes below)
    ConfigParameter[] parameters;
  }
  
  struct Action {
    bytes4 functionSignature;
    bool directlyCallFunction; //function to be called directly on extension contract (used for trusted addresses that are authorized by extension)
    string description;
    Parameter[] parameters;
  }
  
  struct ViewData {
    bytes4 functionSignature;
    Parameter output;
  }
  
  struct ActionStorage {
    bytes4 functionSignature;
    bool directlyCallFunction;
    uint256 parametersCount;
    string description;
    mapping(uint256 => Parameter) parameters;
  }
  
  struct ViewDataStorage {
    bytes4 functionSignature;
    mapping(uint256 => Parameter) parameters;
  }
  
  struct ConfigStorage {
    bytes4 createFunctionSignature;
    bytes4 updateFunctionSignature;
    uint256 parametersCount;
    mapping(uint256 => ConfigParameter) parameters;
  }
  
  ConfigStorage private setupParameters;
  ViewDataStorage[] private viewDatas;
  ActionStorage[] private actions;
  
  constructor() public {
    addConfigurableParameters(getSetupParameters());
    addViewDatas(getViewDatas());
    addActions(getActions());
  }
  
  function getName() pure external returns(string);
  function getDescription() pure external returns(string);
  function getSetupParameters() pure internal returns(Setup);
  function getActions() pure internal returns(Action[]);
  function getViewDatas() pure internal returns(ViewData[]);
    
  // IMPORTANT NOTES
  
  /* All view data functions must receive as arguments an address and a bytes32 (address,bytes32)
   * the arguments are smart account address and the respective identifier
   */
  
  /* Function to create new configurable instance must receive all setup parameters
   * using the same order defined in getSetupParameters() function 
   */
   
  /* Function to update existing configurable instance must receive 
   * respective identifier + all setup parameters (bytes32, [setup parameters])
   * setup parameters must use the same order defined in getSetupParameters() function 
   */
  
  /* Extension must always implement a function with the signature getSetup(address,bytes32)
   * the arguments are smart account address and respective identifier
   * the returns must be the value for all setup parameters 
   * using the same order defined in getSetupParameters() function 
   */ 
    
  function getSetupParametersCount() 
    view 
    public 
    returns(uint256) 
  {
    return setupParameters.parametersCount;
  }
    
  function getViewDatasCount() 
    view 
    public 
    returns(uint256) 
  {
    return viewDatas.length;
  }
    
  function getActionsCount() 
    view 
    public 
    returns(uint256) 
  {
    return actions.length;
  }
    
  function getSetupFunctions() 
    view 
    public 
    returns(bytes4, bytes4) 
  {
    return (setupParameters.createFunctionSignature, setupParameters.updateFunctionSignature);
  }
    
  function getSetupParametersByIndex(uint256 _index) 
    view 
    public 
    returns(bool, bool, bool, uint256, uint256, string) 
  {
    bool isArray;
    bool isOptional;
    uint256 typeReference; 
    uint256 decimals;
    string memory description;
    (isArray, isOptional, typeReference, decimals, description) = getParameter(setupParameters.parameters[_index].parameter);
    return (setupParameters.parameters[_index].isEditable, isArray, isOptional, typeReference, decimals, description);
  }
    
  function getViewDataByIndex(uint256 _index) 
    view 
    public 
    returns(bytes4, bool, bool, uint256, uint256, string) 
  {
    bool isArray;
    bool isOptional;
    uint256 typeReference;
    uint256 decimals;
    string memory description;
    (isArray, isOptional, typeReference, decimals, description) = getParameter(viewDatas[_index].parameters[0]);
    return (viewDatas[_index].functionSignature, isArray, isOptional, typeReference, decimals, description);
  }
    
  function getActionByIndex(uint256 _index) 
    view 
    public 
    returns(bytes4, bool, uint256, string) 
  {
    return (actions[_index].functionSignature, actions[_index].directlyCallFunction, actions[_index].parametersCount, actions[_index].description);
  }
    
  function getActionParametersCountByIndex(uint256 _index) 
    view 
    public 
    returns(uint256) 
  {
    return actions[_index].parametersCount;
  }
    
  function getActionParameterByIndexes(uint256 _actionIndex, uint256 _parameterIndex) 
    view 
    public 
    returns(bool, bool, uint256, uint256, string) 
  {
    return getParameter(actions[_actionIndex].parameters[_parameterIndex]);
  }

  function getParameter(Parameter _parameter)
    pure
    private
    returns(bool, bool, uint256, uint256, string)
  {
    return (_parameter.isArray, _parameter.isOptional, _parameter.typeReference, _parameter.decimals, _parameter.description);
  }
    
  function validateTypeReference(uint256 _typeReference, bool _isArray) 
    pure 
    private 
  {
    require (_typeReference == INTEGER
      || _typeReference == FLOAT 
      || _typeReference == ADDRESS 
      || _typeReference == BOOL
      || _typeReference == DATE
      || (_typeReference == SMARTACCOUNTADDRESS && !_isArray)
      || (_typeReference == IDENTIFIER && !_isArray)
      || (_typeReference == STRING && !_isArray)
      || (_typeReference == BYTE && !_isArray));
  }
    
  function validateDescription(string _description) 
    pure 
    private 
  {
    bytes memory description = bytes(_description);
    require(description.length > 0);
  }
  
  function validateFunction(bytes4 _functionSignature) 
    pure 
    private 
  {
    require(_functionSignature != "");
  }
  
  function addConfigurableParameters(Setup _setup) private {
    require(_setup.createFunctionSignature != _setup.updateFunctionSignature);
    validateFunction(_setup.createFunctionSignature);
    validateFunction(_setup.updateFunctionSignature);
        
    setupParameters.createFunctionSignature = _setup.createFunctionSignature;
    setupParameters.updateFunctionSignature = _setup.updateFunctionSignature;
    setupParameters.parametersCount = _setup.parameters.length;
    for(uint256 i = 0; i < _setup.parameters.length; i++) {
      validateTypeReference(_setup.parameters[i].parameter.typeReference, _setup.parameters[i].parameter.isArray);
      validateDescription(_setup.parameters[i].parameter.description);
      setupParameters.parameters[i] = _setup.parameters[i];
    }
  }
    
  function addActions(Action[] _actions) private {
    require(_actions.length > 0);
    
    for(uint256 i = 0; i < _actions.length; i++) {
      validateDescription(_actions[i].description);
      validateFunction(_actions[i].functionSignature);
      actions.push(ActionStorage(_actions[i].functionSignature, _actions[i].directlyCallFunction, _actions[i].parameters.length, _actions[i].description));
      for(uint256 j = 0; j < _actions[i].parameters.length; j++) {
        validateTypeReference(_actions[i].parameters[j].typeReference, _actions[i].parameters[j].isArray);
        validateDescription(_actions[i].parameters[j].description);
        actions[i].parameters[j] = _actions[i].parameters[j];
      }
    }
  }
    
  function addViewDatas(ViewData[] _viewDatas) private {
    for(uint256 i = 0; i < _viewDatas.length; i++) {
      validateFunction(_viewDatas[i].functionSignature);
      validateTypeReference(_viewDatas[i].output.typeReference, _viewDatas[i].output.isArray);
      validateDescription(_viewDatas[i].output.description);
      viewDatas.push(ViewDataStorage(_viewDatas[i].functionSignature));
      viewDatas[i].parameters[0] = _viewDatas[i].output;
    }
  }
}
