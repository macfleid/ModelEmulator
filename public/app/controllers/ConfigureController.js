var baseNodeUrl = "http://localhost:3000"
var baseEproModelsServerUrl = "http://localhost:8080/EproServer"

////////////////////////////////////////////////////////////////////////////////
//--
////////////////////////////////////////////////////////////////////////////////
/**
 * TODO : change url to be configured partially
 * TODO : method : list eproModels methods
 */
app.controller('_methods', ['GetService', '$scope', function(GetService,$scope) {
    GetService.query("http://localhost:8080/EproServer/model/methods").success(function(data) {
        $scope.data = data.syncModel;
        $scope.definitions = data.definitions;
    });
}]);

////////////////////////////////////////////////////////////////////////////////
//--- methods definitions
////////////////////////////////////////////////////////////////////////////////
var setBaseDefinitionModel = function getBaseDefinitionModel($scope,GetService,$urlDefinition,PostService,_baseValuesQuery) {
    GetService.query($urlDefinition).success(function(data) {
        $scope.data = data.syncModel;
        $scope.dataArray = [];
        $scope.params = data.params;
        $scope.table = data.name;
        $scope.definitions= data.definitions;
        $scope.repeatable = data.unique;
        //-- init params
        $scope.fullData = {params : {}, data : $scope.data};
        if($scope.repeatable)
            getBaseValues(PostService,$scope,_baseValuesQuery);
        else
            getArrayBaseValues(PostService,$scope,_baseValuesQuery);
        getAllTemplates($scope,PostService);
        getKeyInDataTemplates($scope);
    });
}

var setBaseSaveFunction = function BaseSave($scope,PostService) {
    $scope.save = function() {
        var data = {data : $scope.fullData, table : $scope.table};
        if($scope.data._id){
            PostService.query(baseNodeUrl+"/postData/update",data).success(function(data){
                changeMessageServer(false, "Data successfully updated.")
                if($scope.repeatable)
                    getBaseValues(PostService,$scope,_baseValuesQuery);
                else
                    getArrayBaseValues(PostService,$scope,_baseValuesQuery);
            }).error(function(data) {
                changeMessageServer(yes, "Error on updating data.")
            });
        } else {
            PostService.query(baseNodeUrl+"/postData/insert",data).success(function(data){
                changeMessageServer(false, "Data successfully saved.")
                if($scope.repeatable)
                    getBaseValues(PostService,$scope,_baseValuesQuery);
                else
                    getArrayBaseValues(PostService,$scope,_baseValuesQuery);
            }).error(function(data) {
                changeMessageServer(yes, "Error on saving data.")
            });
        }
    }
    $scope.deleteData = function(data) {
        var data = {data: data, table: $scope.table};
        PostService.query(baseNodeUrl + "/postData/delete", data).success(function (data) {
            changeMessageServer(false, "Data successfully deleted.")
            if($scope.repeatable)
                getBaseValues(PostService,$scope,_baseValuesQuery);
            else
                getArrayBaseValues(PostService,$scope,_baseValuesQuery);
        }).error(function (data) {
            changeMessageServer(yes, "Error on deleting data.")
        });
    }
}

var getBaseValues = function getValues(PostService,$scope,_query) {
    PostService.query(baseNodeUrl+"/postData/search", {table:$scope.table,data:_query}).success(function(data) {
        if(data.length > 0) {
            $scope.data = data[0];
        }
    });
}

var getArrayBaseValues = function getValues(PostService,$scope,_query) {
    PostService.query(baseNodeUrl+"/postData/search", {table:$scope.table,data:_query}).success(function(data) {
        if(data.length > 0) {
            $scope.dataArray = data;
        }
    });
}

/**
 * save a new template to database
 * delete a template from database
 * @param $scope
 */
var setSaveTemplateFunction = function addElementFromTemplate($scope,PostService) {
    $scope.saveTemplate = function(template) {
        if(!$scope.definitions) {
            //TODO show error
        }
        var data = {data:template.syncModelDefinition,table:template.name};
        PostService.query(baseNodeUrl+"/postData/insert",data).success(function(data){
            changeMessageServer(false, $scope, template.name + "successfully saved.")
            getAllTemplates($scope, PostService);
        }).error(function(data) {
            changeMessageServer(true, $scope, "Error while saving template : " + template.name);
        });
    }
    $scope.deleteTemplate = function(template, table) {
        if(!template) {
            //TODO show error
        }
        var data = {data:template, table:table};
        PostService.query(baseNodeUrl+"/postData/delete",data).success(function(data){
            changeMessageServer(false, "Template successfully deleted.")
            getAllTemplates($scope,PostService);
        }).error(function(data) {
            changeMessageServer(true,$scope,"Error while deleting template : " + template.name);
        });
    }
}

/**
 * returns all templates from template name
 * @param $scope
 */
var getAllTemplates = function getAllTemplates($scope,PostService) {
    for(var i in $scope.definitions) {
        $scope.definitions[i].data = [];
        PostService.query(baseNodeUrl+"/postData/search", {table:$scope.definitions[i].name,data:undefined})
            .success(function(data) {
                if(data.length > 0) {
                    for(var dataIndex in data) {
                        //add this data to definitions.templateName
                        $scope.definitions[i].data.push(data[dataIndex]);
                    }
                }
        }).error(function(data) {
                console.log("Error while getAllTemplates:"+data);
                //TODO message (show error)
        });
    }
}

/**
 * search if the key correspond to a templates
 * set all templates functions
 * @param element
 * @return [] of elements or null if key not exists in templates
 */
var getKeyInDataTemplates = function getKeyInDataWithTemplates($scope) {
    //--- init
    $scope.view = {};
    $scope.view.tmpModels = {};
    for(var i in $scope.definitions) {
        $scope.view.tmpModels[$scope.definitions[i].key] = "";
    }
    ///-----------------
    $scope.getDataInTemplatesFromKey = function(element) {
        for(var i in $scope.definitions) {
            if ($scope.definitions[i].key == element) {
                return $scope.definitions[i].data == null ? [] :  $scope.definitions[i].data;
            }
        }
        return null;
    }
    $scope.getSearchKey = function(element) {
        for(var i in $scope.definitions) {
            if ($scope.definitions[i].key == element) {
                return $scope.definitions[i].searchKey;
            }
        }
        return null;
    }
    /**
     * push values prefilled into data
     * TODO : refuse values that not exists in template data;
     * TODO : do not add if already exits
     * @param keyEvent
     * @param key
     * @param data
     */
    $scope.onInputWithDataEnter = function(keyEvent,key,data) {
        if(keyEvent.which === 13) {
            if(data == "") {
                return;
            }
            if($scope.data[key] == null) {
                $scope.data[key] = [];
            }
            $scope.data[key].push(data);
        }
    }
}

var changeMessageServer = function changeInformationMessage(isAlert,$scope, message) {
    $scope.serverMessage = message;
    $scope.serverMessageLevel = isAlert;
}

///////////////////////////////////////////////////////////////////////////////////////////
//-- Configurations Controllers
//--- TODO changeUrls
///////////////////////////////////////////////////////////////////////////////////////////

app.controller('ConfigureSettingsInstance', ['PostService','GetService', '$scope', function(PostService,GetService,$scope) {
    $scope.title = 'Instance settings'
    setBaseDefinitionModel($scope,GetService,"http://localhost:8080/EproServer/model/settingsinstance",PostService, undefined);
    setBaseSaveFunction($scope,PostService);
}]);

app.controller('ConfigureStudy', ['PostService','GetService', '$scope', '$controller', function(PostService,GetService,$scope,$controller) {
    $scope.title = 'Study settings'
    setBaseDefinitionModel($scope,GetService,"http://localhost:8080/EproServer/model/study",PostService,undefined);
    setBaseSaveFunction($scope,PostService);
}]);

app.controller('ConfigureSites', ['PostService','GetService', '$scope', '$controller', function(PostService,GetService,$scope,$controller) {
    $scope.title = 'Sites settings'
    setBaseDefinitionModel($scope,GetService,"http://localhost:8080/EproServer/model/sites",PostService,undefined);
    setBaseSaveFunction($scope,PostService);
    setSaveTemplateFunction($scope,PostService);
}]);

app.controller('ConfigureUsers', ['PostService','GetService', '$scope', '$controller', function(PostService,GetService,$scope,$controller) {
    $scope.title = 'Users settings'
    setBaseDefinitionModel($scope,GetService,"http://localhost:8080/EproServer/model/users",PostService,undefined);
    setBaseSaveFunction($scope,PostService);
    setSaveTemplateFunction($scope,PostService);
}]);

app.controller('ConfigureMetadata', ['PostService','GetService', '$scope', '$controller', function(PostService,GetService,$scope,$controller) {
    $scope.title = 'Metadata settings'
    setBaseDefinitionModel($scope,GetService,"http://localhost:8080/EproServer/model/metadata",PostService,undefined);
    setBaseSaveFunction($scope,PostService);
    setSaveTemplateFunction($scope,PostService);
}]);

app.controller('ConfigureEvents', ['PostService','GetService', '$scope', '$controller', function(PostService,GetService,$scope,$controller) {
    $scope.title = 'Metadata Events settings'
    setBaseDefinitionModel($scope,GetService,"http://localhost:8080/EproServer/model/events",PostService,undefined);
    setBaseSaveFunction($scope,PostService);
    setSaveTemplateFunction($scope,PostService);
}]);

app.controller('ConfigureEventForms', ['PostService','GetService', '$scope', '$controller', function(PostService,GetService,$scope,$controller) {
    $scope.title = 'Metadata Events settings'
    setBaseDefinitionModel($scope,GetService,"http://localhost:8080/EproServer/model/eventforms", PostService, undefined);
    setBaseSaveFunction($scope, PostService);
    setSaveTemplateFunction($scope, PostService);
}]);

app.controller('ConfigureForms', ['PostService','GetService', '$scope', '$controller', function(PostService,GetService,$scope,$controller) {
    $scope.title = 'Metadata Events settings'
    setBaseDefinitionModel($scope,GetService,"http://localhost:8080/EproServer/model/forms",PostService,undefined);
    setBaseSaveFunction($scope,PostService);
    setSaveTemplateFunction($scope,PostService);
}]);

app.controller('ConfigureItemDef', ['PostService','GetService', '$scope', '$controller', function(PostService,GetService,$scope,$controller) {
    $scope.title = 'Metadata itemDEF settings'
    setBaseDefinitionModel($scope,GetService,"http://localhost:8080/EproServer/model/itemdef",PostService,undefined);
    setBaseSaveFunction($scope,PostService);
    setSaveTemplateFunction($scope,PostService);
}]);

app.controller('ConfigureFormItems', ['PostService','GetService', '$scope', '$controller', function(PostService,GetService,$scope,$controller) {
    $scope.title = 'Metadata itemDEF settings'
    setBaseDefinitionModel($scope,GetService,"http://localhost:8080/EproServer/model/formitems",PostService,undefined);
    setBaseSaveFunction($scope,PostService);
    setSaveTemplateFunction($scope,PostService);
}]);

app.controller('ConfigureLabels', ['PostService','GetService', '$scope', '$controller', function(PostService,GetService,$scope,$controller) {
    $scope.title = 'Metadata itemDEF settings'
    setBaseDefinitionModel($scope,GetService,"http://localhost:8080/EproServer/model/labels",PostService,undefined);
    setBaseSaveFunction($scope,PostService);
    setSaveTemplateFunction($scope,PostService);
}]);

app.controller('ConfigurePatients', ['PostService','GetService', '$scope', '$controller', function(PostService,GetService,$scope,$controller) {
    $scope.title = 'Metadata itemDEF settings'
    setBaseDefinitionModel($scope,GetService,"http://localhost:8080/EproServer/model/patients",PostService,undefined);
    setBaseSaveFunction($scope,PostService);
    setSaveTemplateFunction($scope,PostService);
}]);