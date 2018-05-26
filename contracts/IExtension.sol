pragma solidity 0.4.24;


import "./ISmartAccount.sol";


//TODO: add events, a LOT of comments
contract IExtension {
	string public baseExtensionVersion = "0.0.1";
	
	//TODO: improve parameter set (maybe find some EIP)
    uint256 constant UINT = 1;
    uint256 constant ADDRESS = 2;
    uint256 constant BOOL = 3;
    uint256 constant STRING = 4;
    uint256 constant BYTE = 5;
	
    struct Parameter {
		string description;
		uint256 typeReference;
		bool isArray;
	}
	
	struct ConfigParameter {
		bool isEditable;
		Parameter parameter;
	}
	
	struct Setup {
	    bytes4 functionSignature;
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
	mapping(address => bytes32[]) private identifier;
	mapping(bytes32 => uint256) private indexes;
	
	constructor() public {
	    addConfigurableParameters(getSetupParameters());
	    addViewDatas(getViewDatas());
	    addActions(getActions());
	}
	
	function getDescription() pure external returns(string);
    function getSetupParameters() pure internal returns(Setup);
    function getActions() pure internal returns(Action[]);
    function getViewDatas() pure internal returns(ViewData[]);
    
    function setIdentifier(address _reference, bytes32 _identifier) internal {
        for (uint256 i = 0; i < identifier[_reference].length; ++i) {
            require(identifier[_reference][i] != _identifier);
        }
        indexes[keccak256(abi.encodePacked(_reference, _identifier))] = identifier[_reference].push(_identifier) - 1;
    }
    
    function removeIdentifier(address _reference, bytes32 _identifier) internal {
        require(getIdentifiersCount(_reference) > 0);
        uint256 index = indexes[keccak256(abi.encodePacked(_reference, _identifier))];
        bytes32 indexReplacer = identifier[_reference][identifier[_reference].length - 1];
        identifier[_reference][index] = indexReplacer;
        indexes[keccak256(abi.encodePacked(_reference, indexReplacer))] = index;
        identifier[_reference].length--;
    }
    
    function getIdentifiers(address _reference) view public returns(bytes32[]) {
        return identifier[_reference];
    }
    
    function getIdentifiersCount(address _reference) view public returns(uint256) {
        return identifier[_reference].length;
    }
    
    function getIdentifierByIndex(address _reference, uint256 _index) view public returns(bytes32) {
        return identifier[_reference][_index];
    }
    
    function getSetupParametersByIndex(uint256 index) view public returns(bool, string, uint256, bool) {
        string memory description;
        uint256 typeReference;
        bool isArray;
        (description, typeReference, isArray) = getParameter(setupParameters.parameters[index].parameter);
        return (setupParameters.parameters[index].isEditable, description, typeReference, isArray);
    }
    
    function getViewDataByIndex(uint256 index) view public returns(bytes4, string, uint256, bool) {
        string memory description;
        uint256 typeReference;
        bool isArray;
        (description, typeReference, isArray) = getParameter(viewDatas[index].parameters[0]);
        return (viewDatas[index].baseData.functionSignature, description, typeReference, isArray);
    }
    
    function getActionParameterByIndexes(uint256 actionIndex, uint256 parameterIndex) view public returns(string, uint256, bool) {
        return getParameter(actions[actionIndex].parameters[parameterIndex]);
    }
    
    function getSetupFunction() view public returns(bytes4) {
        return setupParameters.baseData.functionSignature;
    }
    
    function getActionByIndex(uint256 index) view public returns(bytes4, string) {
        return (actions[index].baseData.functionSignature, actions[index].baseData.description);
    }
    
    function setupParametersCount() view public returns(uint256) {
        return setupParameters.baseData.parametersCount;
    }
    
    function viewDatasCount() view public returns(uint256) {
        return viewDatas.length;
    }
    
    function actionsCount() view public returns(uint256) {
        return actions.length;
    }
    
    function actionParametersCountByIndex(uint256 index) view public returns(uint256) {
        return actions[index].baseData.parametersCount;
    }

    function transferTokenFrom(address _smartAccount, address _tokenAddress, address _to, uint256 _amount) internal {
        bytes memory data = abi.encodePacked(bytes4(keccak256("transfer(address,uint256)")), bytes32(_to), _amount);
        ISmartAccount(_smartAccount).execute(_tokenAddress, 0, 0, data);
    }
    
    function transferEtherFrom(address _smartAccount, address _to, uint256 _amount) internal {
        ISmartAccount(_smartAccount).transfer(_to, _amount);
    }

    function getParameter(Parameter _parameter)
        private
        pure
        returns(string, uint256, bool)
    {
        return (_parameter.description, _parameter.typeReference, _parameter.isArray);
    }
    
    function validateTypeReference(uint256 _typeReference, bool _isArray) pure private {
        require (_typeReference == UINT
            || _typeReference == ADDRESS 
            || _typeReference == BOOL
            || (_typeReference == STRING && !_isArray)
            || (_typeReference == BYTE && !_isArray));
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
            bytes memory description = bytes(_actions[i].description);
            require(description.length > 0);
            Storage memory s;
            s.baseData = setBaseStorage(_actions[i].functionSignature, _actions[i].parameters.length, _actions[i].description);
            actions.push(s);
            for(uint256 j = 0; j < _actions[i].parameters.length; j++) {
                validateTypeReference(_actions[i].parameters[j].typeReference, _actions[i].parameters[j].isArray);
                actions[i].parameters[j] = _actions[i].parameters[j];
            }
        }
    }
    
    function addViewDatas(ViewData[] _viewDatas) private {
        for(uint256 i = 0; i < _viewDatas.length; i++) {
            validateTypeReference(_viewDatas[i].output.typeReference, _viewDatas[i].output.isArray);
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
        s.description = _description;
        s.parametersCount = _parametersCount;
        return s;
    }
}
