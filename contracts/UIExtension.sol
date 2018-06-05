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
    uint256 constant SMARTACCOUNTADDRESS = 8;
	
    struct Parameter {
		bool isArray;
		uint256 typeReference;
		uint256 decimals; //only for INTEGER and FLOAT types (the value that will be multiplied, default 1, not defined 0 is equal 1 too)
		string description;
	}

	struct ConfigParameter {
		bool isEditable;
		Parameter parameter;
	}
	
	struct Setup {
	    bytes4 functionSignature; //function signature to set configurable parameters
		ConfigParameter[] parameters;
	}
	
	struct Action {
	    bytes4 functionSignature;
		string description;
		Parameter[] parameters;
	}
	
	struct ViewData {
		bytes4 functionSignature;
		Parameter output;
	}
	
	struct BaseStorage {
		bytes4 functionSignature;
		uint256 parametersCount;
		string description;
	}
	
	struct Storage {
		BaseStorage baseData;
		mapping(uint256 => Parameter) parameters;
	}
	
	struct ConfigStorage {
		BaseStorage baseData;
		mapping(uint256 => ConfigParameter) parameters;
	}
	
	ConfigStorage private setupParameters;
	Storage[] private viewDatas;
	Storage[] private actions;
	
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
    
    /* All view data functions must receive as arguments address and bytes32 (address,bytes32)
     * the arguments are smart account address and respective identifier
     */
    
    /* Extension must always implement a function with the signature getSetup(address,bytes32)
     * the arguments are smart account address and respective identifier
     * the return must be the value for all setup parameters 
     * using the same order defined in getSetupParameters() function 
     */ 
    
    function getSetupParametersCount() 
        view 
        public 
        returns(uint256) 
    {
        return setupParameters.baseData.parametersCount;
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
    
    function getSetupFunction() 
        view 
        public 
        returns(bytes4) 
    {
        return setupParameters.baseData.functionSignature;
    }
    
    function getSetupParametersByIndex(uint256 _index) 
        view 
        public 
        returns(bool, bool, uint256, uint256, string) 
    {
        bool isArray;
        uint256 typeReference; 
        uint256 decimals;
        string memory description;
        (isArray, typeReference, decimals, description) = getParameter(setupParameters.parameters[_index].parameter);
        return (setupParameters.parameters[_index].isEditable, isArray, typeReference, decimals, description);
    }
    
    function getViewDataByIndex(uint256 _index) 
        view 
        public 
        returns(bytes4, bool, uint256, uint256, string) 
    {
        bool isArray;
        uint256 typeReference;
        uint256 decimals;
        string memory description;
        (isArray, typeReference, decimals, description) = getParameter(viewDatas[_index].parameters[0]);
        return (viewDatas[_index].baseData.functionSignature, isArray, typeReference, decimals, description);
    }
    
    function getActionByIndex(uint256 _index) 
        view 
        public 
        returns(bytes4, string) 
    {
        return (actions[_index].baseData.functionSignature, actions[_index].baseData.description);
    }
    
    function getActionParametersCountByIndex(uint256 _index) 
        view 
        public 
        returns(uint256) 
    {
        return actions[_index].baseData.parametersCount;
    }
    
    function getActionParameterByIndexes(uint256 _actionIndex, uint256 _parameterIndex) 
        view 
        public 
        returns(bool, uint256, uint256, string) 
    {
        return getParameter(actions[_actionIndex].parameters[_parameterIndex]);
    }

    function getParameter(Parameter _parameter)
        private
        pure
        returns(bool, uint256, uint256, string)
    {
        return (_parameter.isArray, _parameter.typeReference, _parameter.decimals, _parameter.description);
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
    
    function addConfigurableParameters(Setup _setup) private {
        setupParameters.baseData = setBaseStorage(_setup.functionSignature, _setup.parameters.length, "");
        for(uint256 i = 0; i < _setup.parameters.length; i++) {
            validateTypeReference(_setup.parameters[i].parameter.typeReference, _setup.parameters[i].parameter.isArray);
            setupParameters.parameters[i] = _setup.parameters[i];
        }
    }
    
    function addActions(Action[] _actions) private {
        require(_actions.length > 0);
        
        for(uint256 i = 0; i < _actions.length; i++) {
            validateDescription(_actions[i].description);
            Storage memory s;
            s.baseData = setBaseStorage(_actions[i].functionSignature, _actions[i].parameters.length, _actions[i].description);
            actions.push(s);
            for(uint256 j = 0; j < _actions[i].parameters.length; j++) {
                validateTypeReference(_actions[i].parameters[j].typeReference, _actions[i].parameters[j].isArray);
                validateDescription(_actions[i].parameters[j].description);
                actions[i].parameters[j] = _actions[i].parameters[j];
            }
        }
    }
    
    function addViewDatas(ViewData[] _viewDatas) private {
        for(uint256 i = 0; i < _viewDatas.length; i++) {
            validateTypeReference(_viewDatas[i].output.typeReference, _viewDatas[i].output.isArray);
            validateDescription(_viewDatas[i].output.description);
            Storage memory s;
            s.baseData = setBaseStorage(_viewDatas[i].functionSignature, 1, "");
            viewDatas.push(s);
            viewDatas[i].parameters[0] = _viewDatas[i].output;
        }
    }
    
    function setBaseStorage(
        bytes4 _functionSignature, 
        uint256 _parametersCount, 
        string _description
    ) 
        private 
        pure 
        returns (BaseStorage) 
    {
        require(_functionSignature != "");
        BaseStorage memory s;
        s.functionSignature = _functionSignature;
        s.parametersCount = _parametersCount;
        s.description = _description;
        return s;
    }
}
