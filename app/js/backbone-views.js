var jquery = $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var chroma = require('chroma-js');
var FileSaver = require('file-saver');
var cytoscape = require('cytoscape');
var chise = require('chise');

var appUtilities = require('./app-utilities');
var setFileContent = appUtilities.setFileContent.bind(appUtilities);
const colorPickerUtils = require('./color-picker-utils');
//var annotationsHandler = require('./annotations-handler');

// since biogene service from PC is not available any more, we now give link to gene properties in My Cancer Genome organization
///**
// * Backbone view for the BioGene information.
// */
//var BioGeneView = Backbone.View.extend({
//  /*
//   * Copyright 2013 Memorial-Sloan Kettering Cancer Center.
//   *
//   * This file is part of PCViz.
//   *
//   * PCViz is free software: you can redistribute it and/or modify
//   * it under the terms of the GNU Lesser General Public License as published by
//   * the Free Software Foundation, either version 3 of the License, or
//   * (at your option) any later version.
//   *
//   * PCViz is distributed in the hope that it will be useful,
//   * but WITHOUT ANY WARRANTY; without even the implied warranty of
//   * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//   * GNU Lesser General Public License for more details.
//   *
//   * You should have received a copy of the GNU Lesser General Public License
//   * along with PCViz. If not, see <http://www.gnu.org/licenses/>.
//   */
//
//  render: function () {
//    // pass variables in using Underscore.js template
//    var variables = {
//      geneDescription: this.model.geneDescription,
//      geneAliases: this.parseDelimitedInfo(this.model.geneAliases, ":", ",", null),
//      geneDesignations: this.parseDelimitedInfo(this.model.geneDesignations, ":", ",", null),
//      geneLocation: this.model.geneLocation,
//      geneMim: this.model.geneMim,
//      geneId: this.model.geneId,
//      geneUniprotId: this.extractFirstUniprotId(this.model.geneUniprotMapping),
//      geneUniprotLinks: this.generateUniprotLinks(this.model.geneUniprotMapping),
//      geneSummary: this.model.geneSummary
//    };
//
//    // compile the template using underscore
//    var template = _.template($("#biogene-template").html());
//    template = template(variables);
//
//    // load the compiled HTML into the Backbone "el"
//    this.$el.html(template);
//
//    // format after loading
//    this.format(this.model);
//
//    return this;
//  },
//  format: function ()
//  {
//    // hide rows with undefined data
//    if (this.model.geneDescription == undefined)
//      this.$el.find(".biogene-description").hide();
//
//    if (this.model.geneAliases == undefined)
//      this.$el.find(".biogene-aliases").hide();
//
//    if (this.model.geneDesignations == undefined)
//      this.$el.find(".biogene-designations").hide();
//
//    if (this.model.geneChromosome == undefined)
//      this.$el.find(".biogene-chromosome").hide();
//
//    if (this.model.geneLocation == undefined)
//      this.$el.find(".biogene-location").hide();
//
//    if (this.model.geneMim == undefined)
//      this.$el.find(".biogene-mim").hide();
//
//    if (this.model.geneId == undefined)
//      this.$el.find(".biogene-id").hide();
//
//    if (this.model.geneUniprotMapping == undefined)
//      this.$el.find(".biogene-uniprot-links").hide();
//
//    if (this.model.geneSummary == undefined)
//      this.$el.find(".node-details-summary").hide();
//
//    var expanderOpts = {slicePoint: 150,
//      expandPrefix: ' ',
//      expandText: ' (...)',
//      userCollapseText: ' (show less)',
//      moreClass: 'expander-read-more',
//      lessClass: 'expander-read-less',
//      detailClass: 'expander-details',
//      // do not use default effects
//      // (see https://github.com/kswedberg/jquery-expander/issues/46)
//      expandEffect: 'fadeIn',
//      collapseEffect: 'fadeOut'};
//
//    $(".biogene-info .expandable").expander(expanderOpts);
//
//    expanderOpts.slicePoint = 2; // show comma and the space
//    expanderOpts.widow = 0; // hide everything else in any case
//  },
//  generateUniprotLinks: function (mapping) {
//    var formatter = function (id) {
//      return _.template($("#uniprot-link-template").html(), {id: id});
//    };
//
//    if (mapping == undefined || mapping == null)
//    {
//      return "";
//    }
//
//    // remove first id (assuming it is already processed)
//    if (mapping.indexOf(':') < 0)
//    {
//      return "";
//    }
//    else
//    {
//      mapping = mapping.substring(mapping.indexOf(':') + 1);
//      return ', ' + this.parseDelimitedInfo(mapping, ':', ',', formatter);
//    }
//  },
//  extractFirstUniprotId: function (mapping) {
//    if (mapping == undefined || mapping == null)
//    {
//      return "";
//    }
//
//    var parts = mapping.split(":");
//
//    if (parts.length > 0)
//    {
//      return parts[0];
//    }
//
//    return "";
//  },
//  parseDelimitedInfo: function (info, delimiter, separator, formatter) {
//    // do not process undefined or null values
//    if (info == undefined || info == null)
//    {
//      return info;
//    }
//
//    var text = "";
//    var parts = info.split(delimiter);
//
//    if (parts.length > 0)
//    {
//      if (formatter)
//      {
//        text = formatter(parts[0]);
//      }
//      else
//      {
//        text = parts[0];
//      }
//    }
//
//    for (var i = 1; i < parts.length; i++)
//    {
//      text += separator + " ";
//
//      if (formatter)
//      {
//        text += formatter(parts[i]);
//      }
//      else
//      {
//        text += parts[i];
//      }
//    }
//
//    return text;
//  }
//});

/**
 * Backbone view for the Chemical information.
 */
var ChemicalView = Backbone.View.extend({
    render: function () {
        // pass variables in using Underscore.js template
        var variables = {
            chemicalDescription: this.model.description[0],
            chebiName: this.model.label,
            chebiID: this.model.obo_id.substring(6, this.model.obo_id.length) //Gets only the nr from ChEBI:15422 format
        };

        // compile the template using underscore
        var template = _.template($("#chemical-template").html());
        template = template(variables);

        // load the compiled HTML into the Backbone "el"
        this.$el.html(template);

        // format after loading
        this.format(this.model);

        return this;
    },
    format: function ()
    {
        // hide rows with undefined data
        if (this.model.label == undefined)
            this.$el.find(".chebi-name").hide();

        if (this.model.description[0] == undefined)
            this.$el.find(".chemical-description").hide();

        if (this.model.obo_id == undefined)
            this.$el.find(".chebi-id").hide();

        var expanderOpts = {slicePoint: 150,
            expandPrefix: ' ',
            expandText: ' (...)',
            userCollapseText: ' (show less)',
            moreClass: 'expander-read-more',
            lessClass: 'expander-read-less',
            detailClass: 'expander-details',
            // do not use default effects
            // (see https://github.com/kswedberg/jquery-expander/issues/46)
            expandEffect: 'fadeIn',
            collapseEffect: 'fadeOut'};

        $(".chemical-description .expandable").expander(expanderOpts);

        expanderOpts.slicePoint = 2; // show comma and the space
        expanderOpts.widow = 0; // hide everything else in any case
    }
});

/**
 * SBGN Layout view for the Sample Application.
 */
var LayoutPropertiesView = Backbone.View.extend({
  initialize: function () {
  },
  copyProperties: function () {

    // use active cy instance
    var cy = appUtilities.getActiveCy();

    // clone default layout props
    var clonedProp = _.clone(appUtilities.defaultLayoutProperties);

    // reset current layout props
    appUtilities.setScratch(cy, 'currentLayoutProperties', clonedProp);

    // return cloned props to make them accessible
    return clonedProp;
  },
  getLayoutOptions: function (preferences, _chiseInstance) {
    // if chise instance param is not set use the recently active chise instance
    var chiseInstance = _chiseInstance || appUtilities.getActiveChiseInstance();

    // get associated cy instance
    var cy = chiseInstance.getCy();

    var currentLayoutProperties = appUtilities.getScratch(cy, 'currentLayoutProperties');

    // if preferences param is not set use an empty map not to override any layout option
    if (preferences === undefined) {
      preferences = {};
    }

    var options = $.extend({}, currentLayoutProperties, preferences);

    return options;
  },
  applyLayout: function (preferences, notUndoable, _chiseInstance) {

    // if chise instance param is not set use the recently active chise instance
    var chiseInstance = _chiseInstance || appUtilities.getActiveChiseInstance();
    var options = this.getLayoutOptions(preferences, _chiseInstance);
    chiseInstance.performLayout(options, notUndoable);
  },
  render: function () {
    var self = this;

    // use active cy instance
    var cy = appUtilities.getActiveCy();

    // get current layout props for cy
    var currentLayoutProperties = appUtilities.getScratch(cy, 'currentLayoutProperties');

    self.template = _.template($("#layout-settings-template").html());
    self.template = self.template(currentLayoutProperties);
    $(self.el).html(self.template);

    $(self.el).modal('show');

    $(document).off("click", "#save-layout").on("click", "#save-layout", function (evt) {

      // use active cy instance
      var cy = appUtilities.getActiveCy();

      // get current layout props for cy
      var currentLayoutProperties = appUtilities.getScratch(cy, 'currentLayoutProperties');

      currentLayoutProperties.nodeRepulsion = Number(document.getElementById("node-repulsion").value);
      currentLayoutProperties.idealEdgeLength = Number(document.getElementById("ideal-edge-length").value);
      currentLayoutProperties.edgeElasticity = Number(document.getElementById("edge-elasticity").value);
      currentLayoutProperties.nestingFactor = Number(document.getElementById("nesting-factor").value);
      currentLayoutProperties.gravity = Number(document.getElementById("gravity").value);
      currentLayoutProperties.numIter = Number(document.getElementById("num-iter").value);
      currentLayoutProperties.tile = document.getElementById("tile").checked;
      currentLayoutProperties.packComponents = document.getElementById("pack-components").checked ? true : false;
      currentLayoutProperties.randomize = !document.getElementById("incremental").checked;
      currentLayoutProperties.gravityRangeCompound = Number(document.getElementById("gravity-range-compound").value);
      currentLayoutProperties.gravityCompound = Number(document.getElementById("gravity-compound").value);
      currentLayoutProperties.gravityRange = Number(document.getElementById("gravity-range").value);
      currentLayoutProperties.tilingPaddingVertical = Number(document.getElementById("tiling-padding-vertical").value);
      currentLayoutProperties.tilingPaddingHorizontal = Number(document.getElementById("tiling-padding-horizontal").value);    
      currentLayoutProperties.initialEnergyOnIncremental = Number(document.getElementById("incremental-cooling-factor").value);
      currentLayoutProperties.improveFlow = document.getElementById("improve-flow").checked;      
      // reset currentLayoutProperties in scratch pad
      appUtilities.setScratch(cy, currentLayoutProperties, 'currentLayoutProperties');

      $(self.el).modal('toggle');
      $(document).trigger('saveLayout', cy);
    });

    $(document).off("click", "#default-layout").on("click", "#default-layout", function (evt) {
      // reset current layout props for active cy instance and get new props
      var currentLayoutProperties = self.copyProperties();

      self.template = _.template($("#layout-settings-template").html());
      self.template = self.template(currentLayoutProperties);
      $(self.el).html(self.template);
    });

    return this;
  }
});


var ColorSchemeInspectorView = Backbone.View.extend({

  initialize: function () {
    var self = this;

    var schemes = appUtilities.mapColorSchemes;
    var schemes_gradient = Object.assign({}, schemes);
    var schemes_3D = Object.assign({}, schemes);
    var invertedScheme = {}; // key: scheme_id, value: scheme that is inverse of another scheme

    for(var id in schemes) {
      var previewColors = schemes[id].preview;

      if(invertedScheme[id]) { // this scheme is the complement of a previous one
        schemes[id].isDisplayed = false;
      }
      else if (schemes[id].invert) { // this scheme has a complement
        invertedScheme[schemes[id].invert] = id;
        schemes[id].isDisplayed = true;
      }
      else if(schemes[id].name == 'Pure White'){ // pure white is not an option for color scheme selection
        continue;
      }
      else { // scheme has no complement, display it normally
        schemes[id].isDisplayed = true;
      }

      schemes_gradient[id] = Object.assign({}, schemes[id]);
      schemes_3D[id] = Object.assign({}, schemes[id]);

      var colorCount = previewColors.length;
      var htmlS  = "";
      var htmlG  = "";
      var html3D = "";

      for(var i=0; i < colorCount; i++) {
        var color = chroma(previewColors[i]);
        // apply default alpha of elements backgrounds, to make it look more like reality
        color = color.alpha(0.5);
        var prct = 100/colorCount;
        htmlS += "<div style='float:left; width:"+prct+"%; height:100%; background-color:"+color.css()+"'></div>";
        htmlG += "<img style='float:left; width:"+prct+"%; height:100%;' src='" + appUtilities.colorCodeToGradientImage[previewColors[i]] + "'>";
        html3D += "<img style='float:left; width:"+prct+"%; height:100%;' src='" + appUtilities.colorCodeTo3DImage[previewColors[i]] + "'>";
      }

      schemes[id].previewHtml = htmlS;
      schemes_gradient[id].previewHtml = htmlG;
      schemes_3D[id].previewHtml = html3D;

    }

    this.schemes = schemes;
    this.schemes_gradient = schemes_gradient;
    this.schemes_3D = schemes_3D;

    // clone markers that are background images (unspecified entity and perturbing agent)
    // get removed when color scheme is updated
    var updateCloneMarkers = function () {
      var chiseInstance = appUtilities.getActiveChiseInstance();
      var cy = appUtilities.getActiveCy();
      var nodesThatNeedCloneMarkerUpdate = cy.nodes().filter(function(node) {
        return ((node.data('class') === "unspecified entity") || 
                (node.data('class') === "perturbing agent")) 
                && 
                node.data('clonemarker');  
      });
      chiseInstance.redrawCloneMarkers(nodesThatNeedCloneMarkerUpdate, true);
    }

    // attach events
    $(document).on("click", "div.color-scheme-choice", function (evt) {
      var cy = appUtilities.getActiveCy();
      var scheme_type = appUtilities.getScratch(cy,'currentGeneralProperties').mapColorSchemeStyle;
      var raw_id = $(this).attr('id');
      var scheme_id = raw_id.replace("map-color-scheme_", "");
      appUtilities.applyMapColorScheme(scheme_id, scheme_type, self);
      updateCloneMarkers();
    });

    $(document).on("change", "#color-scheme-inspector-style-select", function (event) {
      var cy = appUtilities.getActiveCy();
      var current_scheme_id = appUtilities.getScratch(cy,'currentGeneralProperties').mapColorScheme;
      //change the currently displayed html element
      var selected_style = $('#color-scheme-inspector-style-select').val();
      //change to the color scheme choice to match current style
      appUtilities.applyMapColorScheme(current_scheme_id,selected_style,self);
      updateCloneMarkers();
    });

    $(document).on("click", "div.color-scheme-invert-button", function (evt) {
      var raw_id = $(this).attr('id');
      var cy = appUtilities.getActiveCy();
      var scheme_type = appUtilities.getScratch(cy,'currentGeneralProperties').mapColorSchemeStyle;
      var scheme_id = raw_id.replace("map-color-scheme_invert_", "");
      var inverted_id = schemes[scheme_id].invert;
      appUtilities.applyMapColorScheme(inverted_id, scheme_type, self);
      updateCloneMarkers();
    });

    $(document).on("click", "#map-color-scheme-default-button", function (evt) {
      var cy = appUtilities.getActiveCy();
      var defaultColorScheme = appUtilities.defaultGeneralProperties.mapColorScheme;
      var defaultColorSchemeStyle = appUtilities.defaultGeneralProperties.mapColorSchemeStyle;
      appUtilities.applyMapColorScheme(defaultColorScheme, defaultColorSchemeStyle, self); // default color scheme
      updateCloneMarkers();
    });
  
  },
  changeStyle: function(style) {
    if(style == 'solid'){
      $('#solid-color-scheme-display').show();
      $('#gradient-color-scheme-display').hide();
      $('#3D-color-scheme-display').hide();
      $("#color-scheme-inspector-style-select").val("solid");
    }
    else if(style == 'gradient'){
      $('#solid-color-scheme-display').hide();
      $('#gradient-color-scheme-display').show();
      $('#3D-color-scheme-display').hide();
      $("#color-scheme-inspector-style-select").val("gradient");
    }
    else if(style == '3D'){
      $('#solid-color-scheme-display').hide();
      $('#gradient-color-scheme-display').hide();
      $('#3D-color-scheme-display').show();
      $("#color-scheme-inspector-style-select").val("3D");
    }
  },
  render: function () {
  
    
    this.template = _.template($("#color-scheme-inspector-template").html());
    var cy = appUtilities.getActiveCy();
    // scheme_type and current_scheme are used to highlight the current color scheme with the javascript embedded to color-scheme-inspector-template div(line: 2337 in index.html)
    var scheme_type = $("#color-scheme-inspector-style-select").val();
    var current_scheme = appUtilities.getScratch(cy,'currentGeneralProperties').mapColorScheme;
   
    this.$el.empty();
    this.$el.html(this.template({schemes: this.schemes, schemes_gradient: this.schemes_gradient, schemes_3D: this.schemes_3D, scheme_type: scheme_type, current_scheme: current_scheme}));
    
    return this;
  }
});

// provide common functions for different views tied to
// inspector map panels
var GeneralPropertiesParentView = Backbone.View.extend({
  // Apply the properties as they are set
  applyUpdate: function() {

    // use active chise instance
    var chiseInstance = appUtilities.getActiveChiseInstance();

    // use the associated cy instance
    var cy = appUtilities.getActiveCy();

    // get currentGeneralProperties for cy
    var currentGeneralProperties = appUtilities.getScratch(cy, 'currentGeneralProperties');

    // get topologyGrouping instance for cy
    var topologyGrouping = chiseInstance.sifTopologyGrouping;

    chiseInstance.setShowComplexName(currentGeneralProperties.showComplexName);
    chiseInstance.refreshPaddings(); // Refresh/recalculate paddings

    if (currentGeneralProperties.enablePorts) {
      chiseInstance.enablePorts();
    }
    else {
      chiseInstance.disablePorts();
    }

    if (currentGeneralProperties.allowCompoundNodeResize) {
      chiseInstance.considerCompoundSizes();
    }
    else {
      chiseInstance.omitCompoundSizes();
    }

    // Refresh resize grapples
    cy.nodeEditing('get').refreshGrapples();

    cy.style().update();

    $(document).trigger('saveGeneralProperties', cy);
  },
  setPropertiesToDefault: function () {
    var cy = appUtilities.getActiveCy();
    var clonedProps = _.clone(appUtilities.defaultGeneralProperties);
    appUtilities.setScratch(cy, 'currentGeneralProperties', clonedProps);
  }
});

// inherit from GeneralPropertiesParentView
var MapTabGeneralPanel = GeneralPropertiesParentView.extend({
  initialize: function() {
    var self = this;
    // initialize undo-redo parameters
    self.params = {};
    self.params.compoundPadding = {id: "compound-padding", type: "text",
      property: "currentGeneralProperties.compoundPadding", update: self.applyUpdate};

    self.params.arrowScale = {id: "arrow-scale", type: "range",
      property: "currentGeneralProperties.arrowScale"};

    self.params.allowCompoundNodeResize = {id: "allow-compound-node-resize", type: "checkbox",
      property: "currentGeneralProperties.allowCompoundNodeResize", update: self.applyUpdate};

    self.params.inferNestingOnLoad = {id: "infer-nesting-on-load", type: "checkbox",
      property: "currentGeneralProperties.inferNestingOnLoad"};

    self.params.enablePorts = {id: "enable-ports", type: "checkbox",
      property: "currentGeneralProperties.enablePorts", update: self.applyUpdate};

    self.params.enableSIFTopologyGrouping = {id: "enable-sif-topology-grouping", type: "checkbox",
      property: "currentGeneralProperties.enableSIFTopologyGrouping", update: self.applyUpdate};

    self.params.mapName = {id: "map-name", type: "text",
      property: "currentGeneralProperties.mapName"};

    self.params.mapDescription = {id: "map-description", type: "text",
      property: "currentGeneralProperties.mapDescription"};

    self.params.extraHighlightThickness = {id: "highlight-thickness", type: "range",
      property: "currentGeneralProperties.extraHighlightThickness"};  

    self.params.highlightColor = {id: "highlight-color", type: "color",
      property: "currentGeneralProperties.highlightColor"};
   
    // general properties part
    $(document).on("change", "#map-name", function (evt) {

      // use active cy instance
      var cy = appUtilities.getActiveCy();

      self.params.mapName.value = $('#map-name').val();

      // TODO while making such calls appUtilities.undoable flag should be checked
      // if it is not true then the operation should not be undoable
      cy.undoRedo().do("changeMenu", self.params.mapName);

      // use the panel id as the network key
      var networkKey = cy.container().id;

      // update the network tab description as the map name is just changed
      appUtilities.updateNetworkTabDesc(networkKey);

      $('#map-name').blur();
    });

    $(document).on("change", "#map-description", function (evt) {

      // use active cy instance
      var cy = appUtilities.getActiveCy();

      self.params.mapDescription.value = $('#map-description').val();
      cy.undoRedo().do("changeMenu", self.params.mapDescription);
      $('#map-description').blur();
    });

    $(document).on("change", "#map-type", function (evt) {

      var callback = function(){
        $('#map-type').val(chiseInstance.getMapType());
      };
      // use active cy instance
      var cy = appUtilities.getActiveCy();
      var chiseInstance = appUtilities.getActiveChiseInstance();
      var elements = cy.elements();
      
      var newMapType = $("#map-type").val();
      if(cy.elements().length == 0){
        //chiseInstance.elementUtilities.setMapType(newMapType);
        cy.undoRedo().do("changeMapType", {mapType: newMapType, callback : callback});
        $(document).trigger("changeMapTypeFromMenu", [newMapType]);
        return;
      }
      var currentMapType = chiseInstance.getMapType();
      var validChange = false;
      if((currentMapType == 'PD' || currentMapType == 'AF' || currentMapType =='SIF') && newMapType == 'HybridAny' && !validChange){
        validChange = true;

        //ok
      }else if((currentMapType == 'PD' || currentMapType == 'AF') && (newMapType == 'HybridAny' || newMapType == 'HybridSbgn')&& !validChange){
        validChange = true;
        //ok
      }else if(currentMapType =='HybridSbgn' && newMapType == 'HybridAny' && !validChange){
        validChange = true;
      }else if(currentMapType =='HybridSbgn' && (newMapType == 'PD' || newMapType =='AF')){
        
        if(newMapType == 'PD'){
           //check no AF elements in netwrok     
          var checkType = true;     
          for(var i = 0 ; i < elements.length && checkType ;i++){
            if(elements[i].data("language") == "AF"){
              checkType = false;             
            }
          }
          validChange = checkType;     
          
         
        }else{
          //check no PD elements in netwrok
          var checkType = true;     
          for(var i = 0 ; i < elements.length && checkType ;i++){
            if(elements[i].data("language") == "PD"){
              checkType = false;             
            }
          }
          validChange = checkType;     
        }
      }else if(currentMapType == 'HybridAny' && !validChange){
        if(newMapType == 'HybridSbgn'){
           //check no SIF elements in netwrok
           var checkType = true;     
           for(var i = 0 ; i < elements.length && checkType ;i++){
             if(elements[i].data("language") == "SIF"){
               checkType = false;             
             }
           }
           validChange = checkType;     
        }else if(newMapType =='PD'){
           //check no AF  OR SIF elements in netwrok
           var checkType = true;  
          for(var i = 0 ; i < elements.length &&  checkType;i++){
            if(elements[i].data("language") == "AF" || elements[i].data("language") == "SIF"){
              checkType = false;            
            }
          }
          validChange = checkType;  

        }else if(newMapType == 'AF'){
          //check no PD  OR SIF elements in netwrok
          var checkType = true;   
          for(var i = 0 ; i < elements.length && checkType ;i++){
            if(elements[i].data("language") == "PD" || elements[i].data("language") == "SIF"){
              checkType = false;            
            }
          }

          validChange = checkType;  

        }else{
          //check no PD  OR AF elements in netwrok
          var checkType = true;  
          for(var i = 0 ; i < elements.length && checkType ;i++){
            if(elements[i].data("language") == "AF" || elements[i].data("language") == "PD"){
              checkType = false;           
            }
          }

          validChange = checkType;  
        }
      }
       if(validChange){
        cy.undoRedo().do("changeMapType", {mapType: newMapType, callback : callback});
        $(document).trigger("changeMapTypeFromMenu", [newMapType]);
       }else{
        $("#map-type").val(currentMapType);
         appUtilities.promptMapTypeView.render("You cannot change map type "+ appUtilities.mapTypesToViewableText[currentMapType] + " to a map of type "+appUtilities.mapTypesToViewableText[newMapType]+"!");
       }
    
      $('#map-type').blur();
    });
    $(document).on("change", "#compound-padding", function (evt) {
      
      var newValue = Number($('#compound-padding').val());
      if(newValue < 0 ){
        newValue = 0;
      }
      // use active cy instance
      var cy = appUtilities.getActiveCy();

      self.params.compoundPadding.value = Number(newValue);
     // var ur = cy.undoRedo();
      //var actions = [];
      //actions.push({name:"changeMenu", param:self.params.compoundPadding});
      //actions.push({name:"setCompoundPadding", param:self.params.compoundPadding});
     // ur.do("batch", actions);
      cy.undoRedo().do("changeMenu", self.params.compoundPadding);
     
      $('#compound-padding').blur();
    });


    $(document).on("change", "#arrow-scale", function (evt) {

      // use active cy instance
      var cy = appUtilities.getActiveCy();

      self.params.arrowScale.value = Number($('#arrow-scale').val());
      var ur = cy.undoRedo();
      var actions = [];
      actions.push({name: "changeMenu", param: self.params.arrowScale});
      actions.push({name: "changeCss", param: { eles: cy.edges(), name: "arrow-scale",
          valueMap: self.params.arrowScale.value}});
      ur.do("batch", actions);
      $('#arrow-scale').blur();
    });

    $(document).on("change", "#allow-compound-node-resize", function (evt) {

      // use active cy instance
      var cy = appUtilities.getActiveCy();

      self.params.allowCompoundNodeResize.value = $('#allow-compound-node-resize').prop('checked');
      cy.undoRedo().do("changeMenu", self.params.allowCompoundNodeResize);
      $('#allow-compound-node-resize').blur();
    });

    $(document).on("change", "#infer-nesting-on-load", function (evt) {

      // use active cy instance
      var cy = appUtilities.getActiveCy();

      self.params.inferNestingOnLoad.value = $('#infer-nesting-on-load').prop('checked');
      cy.undoRedo().do("changeMenu", self.params.inferNestingOnLoad);
      $('#infer-nesting-on-load').blur();
    });

    $(document).on("change", "#enable-ports", function (evt) {

      // use active cy instance
      var cy = appUtilities.getActiveCy();

      self.params.enablePorts.value = $('#enable-ports').prop('checked');
      cy.undoRedo().do("changeMenu", self.params.enablePorts);
      $('#enable-ports').blur();
    });

    $(document).on("change", "#enable-sif-topology-grouping", function (evt) {

      // use active cy instance
      var cy = appUtilities.getActiveCy();
      var chiseInstance = appUtilities.getActiveChiseInstance();
      // get current general properties for cy
      var currentGeneralProperties = appUtilities.getScratch(cy, 'currentGeneralProperties');
      var actions = [];

      self.params.enableSIFTopologyGrouping.value = $('#enable-sif-topology-grouping').prop('checked');
      var apply = self.params.enableSIFTopologyGrouping.value;

      actions.push({name: "changeMenu", param: self.params.enableSIFTopologyGrouping});
      if ( chiseInstance.elementUtilities.mapType === 'SIF' ) {
        actions.push({name: "applySIFTopologyGrouping", param: { apply }});

        if ( currentGeneralProperties.recalculateLayoutOnComplexityManagement ) {
          var preferences = { randomize: false };
          var layoutOptions = appUtilities.layoutPropertiesView.getLayoutOptions(preferences, chiseInstance);

          var layoutParam = {
            options: layoutOptions
          };

          actions.push({name: "layout", param: layoutParam});
        }
      }

      cy.undoRedo().do("batch", actions);
      // cy.undoRedo().do("changeMenu", self.params.enableSIFTopologyGrouping);
      $('#enable-sif-topology-grouping').blur();
    });

    $(document).on("change", "#highlight-thickness", function(evt) {
      var cy = appUtilities.getActiveCy();
      var viewUtilities = cy.viewUtilities('get');
      self.params.extraHighlightThickness.value = Number($('#highlight-thickness').val());
      self.params.highlightColor.value = $('#highlight-color').val();
      var extraHighlightThickness = self.params.extraHighlightThickness.value;
      var highlightColor = self.params.highlightColor.value;
      
      viewUtilities.changeHighlightStyle(0, {
        'border-width' : function (ele) { 
          return Math.max(parseFloat(ele.data('border-width')) + extraHighlightThickness, 3); 
        }, 'border-color': highlightColor
      }, {
        'width': function (ele) { return Math.max(parseFloat(ele.data('width')) + extraHighlightThickness, 3); },
        'line-color': highlightColor,
        'color': highlightColor,
        'text-border-color': highlightColor,
        'source-arrow-color': highlightColor,
        'target-arrow-color': highlightColor
      });
      
      cy.undoRedo().do("changeMenu", self.params.extraHighlightThickness);
      $('#highlight-thickness').blur();
    });
    
    $(document).on("change", "#highlight-color", function(evt) {
      var cy = appUtilities.getActiveCy();
      var viewUtilities = cy.viewUtilities('get');
      self.params.extraHighlightThickness.value = Number($('#highlight-thickness').val());
      self.params.highlightColor.value = $('#highlight-color').val();
      var extraHighlightThickness = self.params.extraHighlightThickness.value;
      var highlightColor = self.params.highlightColor.value;
      
      viewUtilities.changeHighlightStyle(0, {
        'border-width': function (ele) { 
          return Math.max(parseFloat(ele.data('border-width')) + extraHighlightThickness, 3); 
        }, 
        'border-color': highlightColor
      }, {
        'width': function (ele) { return Math.max(parseFloat(ele.data('width')) + extraHighlightThickness, 3); },
        'line-color': highlightColor,
        'color': highlightColor,
        'text-border-color': highlightColor,
        'source-arrow-color': highlightColor,
        'target-arrow-color': highlightColor
      });
      
      cy.undoRedo().do("changeMenu", self.params.highlightColor);
      $('#highlight-color').blur();
    });
  
    $(document).on("click", "#inspector-map-tab", function (evt) {
      var chiseInstance = appUtilities.getActiveChiseInstance();
      //document.getElementById('map-type').value = chiseInstance.getMapType() ? chiseInstance.getMapType() : "Unknown";
    });

    $(document).on("shown.bs.tab", "#inspector-map-tab", function (evt) {
      var chiseInstance = appUtilities.getActiveChiseInstance();
      if (chiseInstance.getMapType()) {
        document.getElementById('map-type').value = chiseInstance.getMapType();
      }
    });

    $(document).on("click", "#map-general-default-button", function (evt) {

      // use active cy instance
      var cy = appUtilities.getActiveCy();

      var ur = cy.undoRedo();
      var actions = [];

      self.params.allowCompoundNodeResize.value = appUtilities.defaultGeneralProperties.allowCompoundNodeResize;
      self.params.inferNestingOnLoad.value = appUtilities.defaultGeneralProperties.inferNestingOnLoad;
      self.params.enablePorts.value = appUtilities.defaultGeneralProperties.enablePorts;
      self.params.enableSIFTopologyGrouping.value = appUtilities.defaultGeneralProperties.enableSIFTopologyGrouping;
      self.params.compoundPadding.value = appUtilities.defaultGeneralProperties.compoundPadding;
      self.params.arrowScale.value = appUtilities.defaultGeneralProperties.arrowScale;
      self.params.extraHighlightThickness.value = appUtilities.defaultGeneralProperties.extraHighlightThickness;
      self.params.highlightColor.value = appUtilities.defaultGeneralProperties.highlightColor;
      actions.push({name: "changeMenu", param: self.params.allowCompoundNodeResize});
      actions.push({name: "changeMenu", param: self.params.inferNestingOnLoad});
      actions.push({name: "changeMenu", param: self.params.enablePorts});
      actions.push({name: "changeMenu", param: self.params.enableSIFTopologyGrouping});
      actions.push({name: "applySIFTopologyGrouping", param: { apply: self.params.enableSIFTopologyGrouping.value }});
      actions.push({name: "changeMenu", param: self.params.compoundPadding});
      actions.push({name: "changeMenu", param: self.params.arrowScale});
      actions.push({name: "changeCss", param: { eles: cy.edges(), name: "arrow-scale",
          valueMap: self.params.arrowScale.value}});
      actions.push({name: "changeMenu", param: self.params.extraHighlightThickness});
      actions.push({name: "changeMenu", param: self.params.highlightColor});
      ur.do("batch", actions);
    });
  },
  render: function() {

    // use active cy instance
    var cy = appUtilities.getActiveCy();
    var chiseInstance = appUtilities.getActiveChiseInstance();
    // get current general properties for cy
    var currentGeneralProperties = appUtilities.getScratch(cy, 'currentGeneralProperties');
    this.template = _.template($("#map-tab-general-template").html());
    this.$el.empty();
    this.$el.html(this.template(currentGeneralProperties));
    colorPickerUtils.bindPicker2Input('#highlight-color', function(evt) {
      $('#highlight-color').trigger("change");
    });
    $("#map-type").val(chiseInstance.elementUtilities.getMapType());
    return this;
  }
});

// inherit from GeneralPropertiesParentView
var MapTabLabelPanel = GeneralPropertiesParentView.extend({
  initialize: function() {
    var self = this;
    // initialize undo-redo parameters
    self.params = {};
    self.params.dynamicLabelSize = {id: "dynamic-label-size-select", type: "select",
      property: "currentGeneralProperties.dynamicLabelSize"};

    self.params.showComplexName = {id: "show-complex-name", type: "checkbox",
      property: "currentGeneralProperties.showComplexName", update: self.applyUpdate};

    self.params.adjustNodeLabelFontSizeAutomatically = {id: "adjust-node-label-font-size-automatically", type: "checkbox",
      property: "currentGeneralProperties.adjustNodeLabelFontSizeAutomatically"};

    self.params.fitLabelsToNodes = {id: "fit-labels-to-nodes", type: "checkbox",
      property: "currentGeneralProperties.fitLabelsToNodes"};

    self.params.fitLabelsToInfoboxes = {id: "fit-labels-to-infoboxes", type: "checkbox",
      property: "currentGeneralProperties.fitLabelsToInfoboxes"};

    $(document).on("change", 'select[name="dynamic-label-size"]', function (evt) {

      // use active cy instance
      var cy = appUtilities.getActiveCy();

      self.params.dynamicLabelSize.value = $('#dynamic-label-size-select option:selected').val();
      cy.undoRedo().do("changeMenu", self.params.dynamicLabelSize);
      $('#dynamic-label-size-select').blur();
      self.applyUpdate();
    });

    $(document).on("change", "#show-complex-name", function (evt) {

      // use active cy instance
      var cy = appUtilities.getActiveCy();

      self.params.showComplexName.value = $('#show-complex-name').prop('checked');
      cy.undoRedo().do("changeMenu", self.params.showComplexName);
      $('#show-complex-name').blur();
    });

    $(document).on("change", "#adjust-node-label-font-size-automatically", function (evt) {

      // use active cy instance
      var cy = appUtilities.getActiveCy();

      self.params.adjustNodeLabelFontSizeAutomatically.value = $('#adjust-node-label-font-size-automatically').prop('checked');
      cy.undoRedo().do("changeMenu", self.params.adjustNodeLabelFontSizeAutomatically);
      $('#adjust-node-label-font-size-automatically').blur();
      self.applyUpdate();
    });

    $(document).on("change", "#fit-labels-to-nodes", function (evt) {

      // use active cy instance
      var cy = appUtilities.getActiveCy();

      self.params.fitLabelsToNodes.value = $('#fit-labels-to-nodes').prop('checked');
      cy.undoRedo().do("changeMenu", self.params.fitLabelsToNodes);
      $('#fit-labels-to-nodes').blur();
      self.applyUpdate();
    });

    $(document).on("change", "#fit-labels-to-infoboxes", function (evt) {

      // use active cy instance
      var cy = appUtilities.getActiveCy();

      self.params.fitLabelsToInfoboxes.value = $('#fit-labels-to-infoboxes').prop('checked');
      cy.undoRedo().do("changeMenu", self.params.fitLabelsToInfoboxes);
      $('#fit-labels-to-infoboxes').blur();
      self.applyUpdate();
    });
    $(document).on("click", "#map-label-default-button", function (evt) {

      // use active cy instance
      var cy = appUtilities.getActiveCy();

      var ur = cy.undoRedo();
      var actions = [];
      self.params.dynamicLabelSize.value = appUtilities.defaultGeneralProperties.dynamicLabelSize;
      self.params.adjustNodeLabelFontSizeAutomatically.value = appUtilities.defaultGeneralProperties.adjustNodeLabelFontSizeAutomatically;
      self.params.fitLabelsToNodes.value = appUtilities.defaultGeneralProperties.fitLabelsToNodes;
      self.params.fitLabelsToInfoboxes.value = appUtilities.defaultGeneralProperties.fitLabelsToInfoboxes;
      self.params.showComplexName.value = appUtilities.defaultGeneralProperties.showComplexName;

      actions.push({name: "changeMenu", param: self.params.dynamicLabelSize});
      actions.push({name: "changeMenu", param: self.params.adjustNodeLabelFontSizeAutomatically});
      actions.push({name: "changeMenu", param: self.params.fitLabelsToNodes});
      actions.push({name: "changeMenu", param: self.params.fitLabelsToInfoboxes});
      actions.push({name: "changeMenu", param: self.params.showComplexName});
      ur.do("batch", actions);
    });
  },
  render: function() {

    // use the active cy instance
    var cy = appUtilities.getActiveCy();

    // get current general properties of cy
    var currentGeneralProperties = appUtilities.getScratch(cy, 'currentGeneralProperties');

    this.template = _.template($("#map-tab-label-template").html());
    this.$el.empty();
    this.$el.html(this.template(currentGeneralProperties));
    return this;
  }
});

// inherit from GeneralPropertiesParentView
var MapTabRearrangementPanel = GeneralPropertiesParentView.extend({
  initialize: function() {
    var self = this;
    // initialize undo-redo parameters
    self.params = {};
    self.params.recalculateLayoutOnComplexityManagement = {id: "recalculate-layout-on-complexity-management", type: "checkbox",
      property: "currentGeneralProperties.recalculateLayoutOnComplexityManagement"};

    self.params.rearrangeOnComplexityManagement = {id: "rearrange-on-complexity-management", type: "checkbox",
      property: "currentGeneralProperties.rearrangeOnComplexityManagement"};

    self.params.animateOnDrawingChanges = {id: "animate-on-drawing-changes", type: "checkbox",
      property: "currentGeneralProperties.animateOnDrawingChanges"};

    $(document).on("change", "#recalculate-layout-on-complexity-management", function (evt) {

      // use active cy instance
      var cy = appUtilities.getActiveCy();

      self.params.recalculateLayoutOnComplexityManagement.value = $('#recalculate-layout-on-complexity-management').prop('checked');
      cy.undoRedo().do("changeMenu", self.params.recalculateLayoutOnComplexityManagement);
      $('#recalculate-layout-on-complexity-management').blur();
    });

    $(document).on("change", "#rearrange-on-complexity-management", function (evt) {

      // use active cy instance
      var cy = appUtilities.getActiveCy();

      self.params.rearrangeOnComplexityManagement.value = $('#rearrange-on-complexity-management').prop('checked');
      cy.undoRedo().do("changeMenu", self.params.rearrangeOnComplexityManagement);
      $('#rearrange-on-complexity-management').blur();
    });

    $(document).on("change", "#animate-on-drawing-changes", function (evt) {

      // use active cy instance
      var cy = appUtilities.getActiveCy();

      self.params.animateOnDrawingChanges.value = $('#animate-on-drawing-changes').prop('checked');
      cy.undoRedo().do("changeMenu", self.params.animateOnDrawingChanges);
      $('#animate-on-drawing-changes').blur();
    });

    $(document).on("click", "#map-rearrangement-default-button", function (evt) {

      // use active cy instance
      var cy = appUtilities.getActiveCy();

      var ur = cy.undoRedo();
      var actions = [];
      self.params.recalculateLayoutOnComplexityManagement.value = appUtilities.defaultGeneralProperties.recalculateLayoutOnComplexityManagement;
      self.params.rearrangeOnComplexityManagement.value = appUtilities.defaultGeneralProperties.rearrangeOnComplexityManagement;
      self.params.animateOnDrawingChanges.value = appUtilities.defaultGeneralProperties.animateOnDrawingChanges;
      actions.push({name: "changeMenu", param: self.params.recalculateLayoutOnComplexityManagement});
      actions.push({name: "changeMenu", param: self.params.rearrangeOnComplexityManagement});
      actions.push({name: "changeMenu", param: self.params.animateOnDrawingChanges});
      ur.do("batch", actions);
    });
  },
  render: function() {

    // use the active cy instance
    var cy = appUtilities.getActiveCy();

    // get current general properties of cy
    var currentGeneralProperties = appUtilities.getScratch(cy, 'currentGeneralProperties');

    this.template = _.template($("#map-tab-rearrangement-template").html());
    this.$el.empty();
    this.$el.html(this.template(currentGeneralProperties));

    return this;
  }
});

//The render functions for the experimental panel
var experimentTabPanel = GeneralPropertiesParentView.extend({
  initialize: function() {
    var self = this;
    self.params = {};
    self.params.experimentDescription = {id: "map-experiment", type: "text",
    property: "currentGeneralProperties.experimentDescription"};

    $(document).on("click","#load-exp-data-util", function (evt) {
        $("#overlay-data").trigger('click');
    });

    $(document).on("click", "#experiment-remove-all, #experiment-data-remove-all", function (evt) {
      var cy = appUtilities.getActiveCy();
      var param = {self};
      cy.undoRedo().do("updateRemoveAll", param);
      self.render();
    });

    $(document).on("click", "#experiment-hide-all, #experiment-data-hide-all", function (evt) {
      var chiseInstance = appUtilities.getActiveChiseInstance();
      var cy = appUtilities.getActiveCy();
      var params = {};
      params.self = self;
      if(evt.target.value == 'true'){
        cy.undoRedo().do("hideAll", params);
      }
      else{
        cy.undoRedo().do("unhideAll", params);
      }
    });

    // Make the DIV element draggable https://www.w3schools.com/howto/howto_js_draggable.asp
    function makeElementDraggable(elmnt) {
      var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
      if (document.getElementById(elmnt.id + "-header")) {
        // if present, the header is where you move the DIV from:
        document.getElementById(elmnt.id + "-header").onmousedown = dragMouseDown;
      } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;
      }

      function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
      }

      function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
      }

      function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
      }
    }

    $(document).on("click", "#show-experiment-data-as-table", function () {
      var divId = 'draggable-exp-data-div';
      
      if ($('#' + divId).is(':visible')) {
        return;
      }
      var chiseInstance = appUtilities.getActiveChiseInstance();
      var data = chiseInstance.getExperimentalData().parsedDataMap;
      makeElementDraggable(document.getElementById(divId));
      $('#' + divId).show();
      fillTable4ExpData(document.getElementById('map-exp-table'), data);

      $(document).off('keyup', '#search-exp-table');
      $(document).on('keyup', '#search-exp-table', _.debounce(function () {
        searchTable(document.getElementById('map-exp-table'), $('#search-exp-table').val());
      }, 250));
    });

    $(document).on("click", "#close-experiment-data-as-table", function () {
      $('#draggable-exp-data-div').hide();
    });

    function fillTable4ExpData(elem, data) {
      var headers = ['Node'];
      var fileNames = {};
      var experiments = {};
      var s = '';

      for (var node in data) {
        for (var exp in data[node]) {
          experiments[exp] = true;
        }
      }

      for (var h in experiments) {
        var arr = h.split('?');
        if (!fileNames[arr[0]]) {
          fileNames[arr[0]] = 1; // for colspan
        } else {
          fileNames[arr[0]] += 1; // for colspan
        }
        headers.push(arr[arr.length-1]);
      }

      // insert file names as "headers" of html table
      s += '<tr><th style="border: 0px;"></th>'
      for (let i in fileNames) {
        s += `<th class="text-center" style="border: 0px;" colspan="${fileNames[i]}">${i}</td>`;
      }
      s += '</tr>'

      s += '<tr>'
      for (let i = 0; i < headers.length; i++) {
        var centerer = '';
        if (i > 0) {
          centerer = 'class="text-center"';
        }
        s += `<th id="sortable-table-header-${i}" style="cursor: pointer;" title="sort" ${centerer}>${headers[i]}</th>`
      }
      s += '</tr>'

      // insert table columns
      var nodeCnt = 0;
      var nodeLabels = [];
      for (var node in data) {
        nodeLabels.push(node);
        s += `<tr id="hoverable-table-row-${nodeCnt++}"><td>${node}</td>`;
        for (var exp in experiments) {
          s += `<td class="text-center">${data[node][exp] || '-'}</td>`
        }
        s += '</tr>';
      }
      elem.innerHTML = s;
      var tableInitialOrderHtml = s;
      var tableOrdering = 'initialOrder';
      // change `let i` to `var i` to see the difference
      for (let i = 0; i < headers.length; i++) {
        $(document).off('click', '#sortable-table-header-' + i);
        $(document).on('click', '#sortable-table-header-' + i, function () {
          if (tableOrdering === 'initialOrder') {
            sortTable(document.getElementById('map-exp-table'), i, 'asc');
            tableOrdering = 'ascendingOrder';
          }
          else if (tableOrdering === 'ascendingOrder') {
            sortTable(document.getElementById('map-exp-table'), i, 'desc');
            tableOrdering = 'descendingOrder';
          }
          else if (tableOrdering === 'descendingOrder') {
            elem.innerHTML = tableInitialOrderHtml;
            tableOrdering = 'initialOrder';
          }
        });
      }

      for (let i = 0; i < nodeCnt; i++) {
        $(document).off('mouseenter', '#hoverable-table-row-' + i);
        $(document).off('mouseleave', '#hoverable-table-row-' + i);
        $(document).on('mouseenter', '#hoverable-table-row-' + i, () => {
          var cy = appUtilities.getActiveCy();
          var vu = cy.viewUtilities('get');
          var eles = cy.nodes().filter(x => x.data('label') == nodeLabels[i]);
          vu.highlight(eles, 2);
        });
        $(document).on('mouseleave', '#hoverable-table-row-' + i, () => {
          var cy = appUtilities.getActiveCy();
          var vu = cy.viewUtilities('get');
          var eles = cy.nodes().filter(x => x.data('label') == nodeLabels[i]);
          vu.removeHighlights(eles);
        });
      }
    }

    function searchTable(table, filter, searchIdxes) {
      if (!searchIdxes) {
        searchIdxes = [0];
      }
      filter = filter.toUpperCase();
      var rows = table.getElementsByTagName('tr');

      // Loop through all table rows, and hide those who don't match the search query
      for (var i = 0; i < rows.length; i++) {
        for (var j = 0; j < searchIdxes.length; j++) {
          var col = rows[i].getElementsByTagName('td')[searchIdxes[0]];
          if (col) {
            var txt = col.textContent || col.innerText;
            if (txt.toUpperCase().indexOf(filter) > -1) {
              rows[i].style.display = '';
            } else {
              rows[i].style.display = 'none';
            }
          }
        }
      }
    }

    // makes bubble sort based on column index in specified direction
    function sortTable(table, colIdx, dir) {
      var rows, switching, i, x, y, shouldSwitch, switchcount = 0;
      switching = true;
      // Set the sorting direction to ascending:
      if (!dir) {
        dir = 'asc';
      }
      if (!colIdx) {
        colIdx = 0;
      }
      /* Make a loop that will continue until
      no switching has been done: */
      while (switching) {
        // Start by saying: no switching is done:
        switching = false;
        rows = table.rows;
        /* Loop through all table rows (except the
        first, which contains table headers): */
        for (i = 1; i < rows.length - 1; i++) {
          // Start by saying there should be no switching:
          shouldSwitch = false;
          /* Get the two elements you want to compare,
          one from current row and one from the next: */
          x = rows[i].getElementsByTagName('td')[colIdx];
          y = rows[i + 1].getElementsByTagName('td')[colIdx];
          if (!x || !y) {
            continue;
          }
          var v1 = x.innerHTML;
          var v2 = y.innerHTML;
          if (!isNaN(v1)) {
            v1 = +v1;
          }
          if (!isNaN(v2)) {
            v2 = +v2;
          }
          /* Check if the two rows should switch place,
          based on the direction, asc or desc: */
          if (dir == 'asc') {
            // "-" is special character to show emmptiness
            if (v1 > v2 || (v1 != '-' && v2 == '-') ) {
              // If so, mark as a switch and break the loop:
              shouldSwitch = true;
              break;
            }
          } else if (dir == 'desc') {
            if (v1 < v2 || (v1 == '-' && v2 != '-')) {
              // If so, mark as a switch and break the loop:
              shouldSwitch = true;
              break;
            }
          }
        }
        if (shouldSwitch) {
          /* If a switch has been marked, make the switch
          and mark that a switch has been done: */
          rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
          switching = true;
          // Each time a switch is done, increase this count by 1:
          switchcount++;
        } else {
          /* If no switching has been done AND the direction is "asc",
          set the direction to "desc" and run the while loop again. */
          if (switchcount == 0 && dir == 'asc') {
            dir = 'desc';
            switching = true;
          }
        }
      }
    }

    $(document).on("click", '[id^="experiment-file-vis-"]', function (evt) {
      var chiseInstance = appUtilities.getActiveChiseInstance();
      var cy = appUtilities.getActiveCy();
      var fileName = this.id.substring(20);
      var subExperiments = $('[id^="experiment-vis-' + filename + '"]');
      var params = {fileName};
      params.self = self;

      if(this.value === "true"){
        cy.undoRedo().do("fileHide", params);
      }
      else{
        cy.undoRedo().do("fileUnhide", params);
      }
      self.render();
    });
    //file delete button
    $(document).on("click", '[id^="experiment-file-delete-"]', function (evt) {
      var cy = appUtilities.getActiveCy();
      var chiseInstance = appUtilities.getActiveChiseInstance();
      var fileName = evt.target.id.substring(23);
      var param = {fileName, self, document};
      cy.undoRedo().do("deleteFile", param); 
    });
    //change experiment visibilty
    $(document).on("click", '[id^="experiment-vis-"]', function (evt) {
      var expRep = evt.target.id.substring(15);
      var index = expRep.indexOf('?');
      var fileName = expRep.substring(0,index);
      var expName = expRep.substring(index+1);
      var params = {fileName, expName};
      params.evt = evt;
      params.self=self;
      var cy = appUtilities.getActiveCy();
      var chiseInstance = appUtilities.getActiveChiseInstance();
      if(evt.target.value === "true"){
        cy.undoRedo().do("hideExperimentPanel", params);
      }
      else{
        cy.undoRedo().do("unhideExperimentPanel", params);
      }
    });
    //remove experiment
    $(document).on("click", '[id^="experiment-delete-"]', function (evt) {
      var cy = appUtilities.getActiveCy();
      var chiseInstance = appUtilities.getActiveChiseInstance();
      var expRep = evt.target.id.substring(18);
      var cy = appUtilities.getActiveCy();
      var index = expRep.indexOf('?');
      var fileName = expRep.substring(0,index);
      var expName = expRep.substring(index+1);
      var param = {self, fileName, expName, document}
      cy.undoRedo().do("updateExperimentPanel", param);
    });
  },

  recalculate: function(){
    var cy = appUtilities.getActiveCy();
    var chiseInstance = appUtilities.getActiveChiseInstance();
    var self = this;
    var fileNames = chiseInstance.getGroupedDataMap();
    param = self;
    self.params.experimentDescription.value =  fileNames;
    cy.undoRedo().do("expOnLoad", param);
  },

  loadExperiment: function(params){
    $(".validation-mode-tab").removeClass("active");
    $('#inspector-map-tab a').tab('show');
   
    var panels =  $("#sbgn-inspector-map").find(".panel-heading");
    for(var i = 0 ; i < panels.length; i++ ){
      if(!$(panels[i]).hasClass("collapsed") && panels[i].id != "sbgn-inspector-map-properties-experiment-heading"){
        $(panels[i]).click();
      }
    }
  
    if($("#sbgn-inspector-map-properties-experiment-heading").hasClass("collapsed")) {
      $('#sbgn-inspector-map-properties-experiment-heading').click();
    }
    var cy = appUtilities.getActiveCy();
    var chiseInstance = appUtilities.getActiveChiseInstance();
    var generalProperties = appUtilities.getScratch(cy, 'currentGeneralProperties');
    var firstExperiment = generalProperties.experimentDescription;
    var self = this;
    var fileNames = chiseInstance.getGroupedDataMap();
    params.self = self;
    self.params.experimentDescription.value =  fileNames;
    params.document = document;
    params.value = generalProperties.mapColorScheme;
    params.scheme_type = generalProperties.mapColorSchemeStyle;
    params.self2 = appUtilities.colorSchemeInspectorView;
   
    var ur = cy.undoRedo();
    var actions = [];
    //after the deleting the first experiemnt color schme should come back
    if(firstExperiment == undefined || Object.keys(firstExperiment).length == 0 || params.sampleExperiment)
    {
      var defaultColorScheme = appUtilities.defaultGeneralProperties.mapColorScheme;
      var defaultColorSchemeStyle = appUtilities.defaultGeneralProperties.mapColorSchemeStyle;
      actions = appUtilities.getActionsToApplyMapColorScheme(defaultColorScheme, defaultColorSchemeStyle, appUtilities.colorSchemeInspectorView);
      actions.push({name: "loadExperiment", param: params});
      ur.do("batch", actions);
    }
    else{
      cy.undoRedo().do("loadMore", params);
    }
  },

  render: function() {
   
    var cy = appUtilities.getActiveCy();
    var self = this;
    var chiseInstance = appUtilities.getActiveChiseInstance();
    var currentGeneralProperties = appUtilities.getScratch(cy, 'currentGeneralProperties');
    self.template = _.template($("#map-tab-experiment-template").html());
    currentGeneralProperties.experimentDescription = chiseInstance.getGroupedDataMap();
    this.$el.html(this.template(currentGeneralProperties));
    var refreshButtons = function(param){
      var document = param.document;
      var visibleDataMapByExp = param.visibleDataMapByExp;
      var visibleFiles = param.visibleFiles;
      var fileDescription = param.fileDescription;
      var allVis = param.allVis;
      var fileTitle = param.fileTitle;
      for (let i in visibleDataMapByExp)
      {
        var index = i.indexOf('?');
        var fileName = i.substring(0,index);
        var expName = i.substring(index+1);
        var buttonName = "experiment-vis-"+ fileName+ "?" + expName;
        var button = document.getElementById(buttonName);
        if(button != null){
          if(visibleDataMapByExp[i] == true ||visibleDataMapByExp[i] === true ){
            button.value = "true";
            button.style.backgroundColor = "";
          }
          else {
            button.value = "false";
            button.style.backgroundColor = "#EAEAEA";
            button.style.color = "#FFFFFF";
          }
        }
      }
      for (let i in visibleFiles){

        var buttonName = "experiment-file-vis-"+ i;
        var button = document.getElementById(buttonName);
        
        if(button != null){
          if(fileTitle[i] != undefined && fileDescription[i] != undefined)
          {
            button.title = button.title + i + " \x0A(" + fileTitle[i].replace(/(\r\n|\n|\r)/gm,"") + ":\x0A" + fileDescription[i].replace(/(\r\n|\n|\r)/gm,"") + ")";
          }
          else if(fileDescription[i] != undefined){
            button.title = button.title + i + " \x0A(" + fileDescription[i].replace(/(\r\n|\n|\r)/gm,"") + ")";
          }
          else if(fileTitle[i] != undefined)
          { 
            button.title = button.title + i + " \x0A(" + fileTitle[i].replace(/(\r\n|\n|\r)/gm,"") + ")"; 
          } 
          else{
            button.title = button.title + i;
          }
       
          if(visibleFiles[i] == true ||visibleFiles[i] === true ){
            button.value = "true";
            button.style.backgroundColor = "";
          }
          else {
            button.value = "false";
            button.style.backgroundColor = "#EAEAEA";
            button.style.color = "#FFFFFF";
          }
        }
      }

      var buttonName = "experiment-hide-all";
      var button = document.getElementById(buttonName);

      if(button != null){
        if(allVis){
          button.value = "true";
          button.style.backgroundColor = "";
        }
        else {
          button.value = "false";
          button.style.backgroundColor = "#EAEAEA";
          button.style.color = "#FFFFFF";
        }
      }

      buttonName = "experiment-data-hide-all";
      button = document.getElementById(buttonName);
      if(button != null){
        if(allVis){
          button.value = "true";
         
        }
        else {
          button.value = "false";        
        }
      }
    }
    var experimentalParams = chiseInstance.getExperimentalData();
    experimentalParams.document = document;
    refreshButtons(experimentalParams);
    //chiseInstance.buttonUpdate(document);
    if( currentGeneralProperties.experimentDescription.length  > 0 || Object.entries(currentGeneralProperties.experimentDescription).length != 0){
     //document.getElementById('sbgn-inspector-map-color-scheme').style.visibility = "hidden";
     document.getElementById('sbgn-inspector-map-color-scheme').style.display = "none";
    }
    else{
    document.getElementById('sbgn-inspector-map-color-scheme').style.display = "";
    // document.getElementById('sbgn-inspector-map-color-scheme').style.visibility = "initial";
    }
    return this;
  }
});

/**
 * SBGN Properties view for the Sample Application.
 */
/*var GeneralPropertiesView = Backbone.View.extend({
  initialize: function () {
    var self = this;

    $(document).on("click", "#default-sbgn", function (evt) {
      self.setPropertiesToDefault();
      self.applyUpdate();
      self.render();
    });

  },
  // Apply the properties as they are set
  applyUpdate: function() {
    chise.setShowComplexName(appUtilities.currentGeneralProperties.showComplexName);
    var compoundPaddingValue = chise.refreshPaddings(); // Refresh/recalculate paddings
    appUtilities.currentLayoutProperties.paddingCompound = appUtilities.defaultLayoutProperties.paddingCompound + (compoundPaddingValue - 5);

    if (appUtilities.currentGeneralProperties.enablePorts) {
      chise.enablePorts();
    }
    else {
      chise.disablePorts();
    }

    cy.style().update();

    $(document).trigger('saveGeneralProperties');
  },
  setPropertiesToDefault: function () {
    appUtilities.currentGeneralProperties = _.clone(appUtilities.defaultGeneralProperties);
  },
  render: function () {
    console.log("render general", appUtilities.currentGeneralProperties);
    this.template = _.template($("#general-properties-template").html());
    this.$el.empty();
    this.$el.html(this.template(appUtilities.currentGeneralProperties));

    return this;
  }
});*/


String.prototype.replaceAll = function(search, replace)
{
    //if replace is not sent, return original string otherwise it will
    //replace search string with 'undefined'.
    if (replace === undefined) {
        return this.toString();
    }

    return this.replace(new RegExp('[' + search + ']', 'g'), replace);
};

//Global variable used to check which PathwayCommon dialog was open recently
//Clicking Ok in Error dialog will redirect to opening of that certain dialog again
var PCdialog = "";

/**
 * Neighborhood Query view for the Sample Application.
 */
var NeighborhoodQueryView = Backbone.View.extend({
  defaultQueryParameters: {
    geneSymbols: "",
    lengthLimit: 1
  },
  currentQueryParameters: null,
  initialize: function () {
    var self = this;
    self.copyProperties();
    self.template = _.template($("#query-neighborhood-template").html());
    self.template = self.template(self.currentQueryParameters);
  },
  copyProperties: function () {
    this.currentQueryParameters = _.clone(this.defaultQueryParameters);
  },
  render: function () {

    var self = this;
    self.template = _.template($("#query-neighborhood-template").html());
    self.template = self.template(self.currentQueryParameters);
    $(self.el).html(self.template);

    $(self.el).modal('show');
    PCdialog = "Neighborhood";

    $(document).off("click", "#save-query-neighborhood").on("click", "#save-query-neighborhood", function (evt) {

      // use active chise instance
      var chiseInstance = appUtilities.getActiveChiseInstance();

      // use the associated cy instance
      var cy = chiseInstance.getCy();

      self.currentQueryParameters.geneSymbols = document.getElementById("query-neighborhood-gene-symbols").value;
      self.currentQueryParameters.lengthLimit = Number(document.getElementById("query-neighborhood-length-limit").value);

      var geneSymbols = self.currentQueryParameters.geneSymbols.trim();
      if (geneSymbols.length === 0) {
          document.getElementById("query-neighborhood-gene-symbols").focus();
          return;
      }
      // geneSymbols is cleaned up from undesired characters such as #,$,! etc. and spaces put before and after the string
      geneSymbols = geneSymbols.replace(/[^a-zA-Z0-9\n\t ]/g, "").trim();
      if (geneSymbols.length === 0) {
        $(self.el).modal('toggle');
        new PromptInvalidQueryView({el: '#prompt-invalidQuery-table'}).render();
        return;
      }
      if (self.currentQueryParameters.lengthLimit > 2) {
        $(self.el).modal('toggle');
        new PromptInvalidLengthLimitView({el: '#prompt-invalidLengthLimit-table'}).render();
        document.getElementById("query-neighborhood-length-limit").focus();
        return;
      }

      var queryURL = "http://www.pathwaycommons.org/pc2/graph?format=SBGN&kind=NEIGHBORHOOD&limit="
          + self.currentQueryParameters.lengthLimit;
      var geneSymbolsArray = geneSymbols.replaceAll("\n", " ").replaceAll("\t", " ").split(" ");

      var filename = "";
      var sources = "";
      for (var i = 0; i < geneSymbolsArray.length; i++) {
        var currentGeneSymbol = geneSymbolsArray[i];
        if (currentGeneSymbol.length == 0 || currentGeneSymbol == ' '
            || currentGeneSymbol == '\n' || currentGeneSymbol == '\t') {
            continue;
        }
        sources = sources + "&source=" + currentGeneSymbol;

        if (filename == '') {
            filename = currentGeneSymbol;
        } else {
            filename = filename + '_' + currentGeneSymbol;
        }
      }
      filename = filename + '_NEIGHBORHOOD.nwt';
      queryURL = queryURL + sources;

      if(cy.nodes().length == 0){

        chiseInstance.startSpinner('neighborhood-spinner');
        var currentGeneralProperties = appUtilities.getScratch(cy, 'currentGeneralProperties');
        var currentInferNestingOnLoad = currentGeneralProperties.inferNestingOnLoad;
        var currentLayoutProperties = appUtilities.getScratch(cy, 'currentLayoutProperties');
        
        $.ajax({
          type: 'get',
          url: "/utilities/testURL",
          data: {url: queryURL},
          success: function(data){
            if (!data.error && data.response.statusCode == 200 && data.response.body) {
              var xml = $.parseXML(data.response.body);
              $(document).trigger('sbgnvizLoadFile', [ filename, cy ]);
              currentGeneralProperties.inferNestingOnLoad = false;
              chiseInstance.updateGraph(chiseInstance.convertSbgnmlToJson(xml), undefined, currentLayoutProperties);
              currentGeneralProperties.inferNestingOnLoad = currentInferNestingOnLoad;
              chiseInstance.endSpinner('neighborhood-spinner');
              $(document).trigger('sbgnvizLoadFileEnd', [ filename, cy ]);
            }
            else if (data.response.body === "") {
              new PromptEmptyQueryResultView({el: '#prompt-emptyQueryResult-table'}).render();
              chiseInstance.endSpinner('neighborhood-spinner');
            }
            else {
              new PromptInvalidQueryView({el: '#prompt-invalidQuery-table'}).render();
              chiseInstance.endSpinner('neighborhood-spinner');
            }
          },
          error: function(xhr, options, err){
            new PromptInvalidQueryView({el: '#prompt-invalidQuery-table'}).render();
            chiseInstance.endSpinner('neighborhood-spinner');
          }
        });

        $(self.el).modal('toggle');

      }
      else{

        new PromptConfirmationView({el: '#prompt-confirmation-table'}).render(function(){

          chiseInstance.startSpinner('neighborhood-spinner');
          var currentGeneralProperties = appUtilities.getScratch(cy, 'currentGeneralProperties');
          var currentInferNestingOnLoad = currentGeneralProperties.inferNestingOnLoad;
          var currentLayoutProperties = appUtilities.getScratch(cy, 'currentLayoutProperties');        

          $.ajax({
            type: 'get',
            url: "/utilities/testURL",
            data: {url: queryURL},
            success: function(data){
              if (!data.error && data.response.statusCode == 200 && data.response.body) {
                var xml = $.parseXML(data.response.body);
                $(document).trigger('sbgnvizLoadFile', [ filename, cy ]);
                currentGeneralProperties.inferNestingOnLoad = false;
                chiseInstance.updateGraph(chiseInstance.convertSbgnmlToJson(xml), undefined, currentLayoutProperties);
                currentGeneralProperties.inferNestingOnLoad = currentInferNestingOnLoad;
                chiseInstance.endSpinner('neighborhood-spinner');
                $(document).trigger('sbgnvizLoadFileEnd', [ filename, cy ]);
              }
              else if (data.response.body === "") {
                new PromptEmptyQueryResultView({el: '#prompt-emptyQueryResult-table'}).render();
                chiseInstance.endSpinner('neighborhood-spinner');
              }
              else {
                new PromptInvalidQueryView({el: '#prompt-invalidQuery-table'}).render();
                chiseInstance.endSpinner('neighborhood-spinner');
              }
            },
            error: function(xhr, options, err){
              new PromptInvalidQueryView({el: '#prompt-invalidQuery-table'}).render();
              chiseInstance.endSpinner('neighborhood-spinner');
            }
          });

          $(self.el).modal('toggle');

        });

      }

    });

    $(document).off("click", "#cancel-query-neighborhood").on("click", "#cancel-query-neighborhood", function (evt) {
      $(self.el).modal('toggle');
    });

    return this;
  }
});

/**
 * Paths Between Query view for the Sample Application.
 */
var PathsBetweenQueryView = Backbone.View.extend({
    defaultQueryParameters: {
        geneSymbols: "",
        lengthLimit: 1
    },
    currentQueryParameters: null,
    initialize: function () {
        var self = this;
        self.copyProperties();
        self.template = _.template($("#query-pathsbetween-template").html());
        self.template = self.template(self.currentQueryParameters);
    },
    copyProperties: function () {
        this.currentQueryParameters = _.clone(this.defaultQueryParameters);
    },
    render: function () {

        var self = this;
        self.template = _.template($("#query-pathsbetween-template").html());
        self.template = self.template(self.currentQueryParameters);
        $(self.el).html(self.template);

        $(self.el).modal('show');
        PCdialog = "PathsBetween";

        $(document).off("click", "#save-query-pathsbetween").on("click", "#save-query-pathsbetween", function (evt) {

            // use active chise instance
            var chiseInstance = appUtilities.getActiveChiseInstance();

            // use the associated cy instance
            var cy = chiseInstance.getCy();

            self.currentQueryParameters.geneSymbols = document.getElementById("query-pathsbetween-gene-symbols").value;
            self.currentQueryParameters.lengthLimit = Number(document.getElementById("query-pathsbetween-length-limit").value);

            var geneSymbols = self.currentQueryParameters.geneSymbols.trim();
            if (geneSymbols.length === 0) {
                document.getElementById("query-pathsbetween-gene-symbols").focus();
                return;
            }
            // geneSymbols is cleaned up from undesired characters such as #,$,! etc. and spaces put before and after the string
            geneSymbols = geneSymbols.replace(/[^a-zA-Z0-9\n\t ]/g, "").trim();
            if (geneSymbols.length === 0) {
                $(self.el).modal('toggle');
                new PromptInvalidQueryView({el: '#prompt-invalidQuery-table'}).render();
                return;
            }
            if (self.currentQueryParameters.lengthLimit > 3) {
                $(self.el).modal('toggle');
                new PromptInvalidLengthLimitView({el: '#prompt-invalidLengthLimit-table'}).render();
                document.getElementById("query-pathsbetween-length-limit").focus();
                return;
            }

            var queryURL = "http://www.pathwaycommons.org/pc2/graph?format=SBGN&kind=PATHSBETWEEN&limit="
                + self.currentQueryParameters.lengthLimit;
            var geneSymbolsArray = geneSymbols.replaceAll("\n", " ").replaceAll("\t", " ").split(" ");

            var filename = "";
            var sources = "";
            for (var i = 0; i < geneSymbolsArray.length; i++) {
                var currentGeneSymbol = geneSymbolsArray[i];
                if (currentGeneSymbol.length == 0 || currentGeneSymbol == ' '
                    || currentGeneSymbol == '\n' || currentGeneSymbol == '\t') {
                    continue;
                }
                sources = sources + "&source=" + currentGeneSymbol;

                if (filename == '') {
                    filename = currentGeneSymbol;
                } else {
                    filename = filename + '_' + currentGeneSymbol;
                }
            }
            filename = filename + '_PATHSBETWEEN.nwt';
            queryURL = queryURL + sources;

            if(cy.nodes().length == 0){

              chiseInstance.startSpinner('paths-between-spinner');
              var currentGeneralProperties = appUtilities.getScratch(cy, 'currentGeneralProperties');
              var currentInferNestingOnLoad = currentGeneralProperties.inferNestingOnLoad;
              var currentLayoutProperties = appUtilities.getScratch(cy, 'currentLayoutProperties');   

              $.ajax({
                type: 'get',
                url: "/utilities/testURL",
                data: {url: queryURL},
                success: function(data){
                  if (!data.error && data.response.statusCode == 200 && data.response.body) {
                    var xml = $.parseXML(data.response.body);
                    $(document).trigger('sbgnvizLoadFile', [ filename, cy ]);
                    currentGeneralProperties.inferNestingOnLoad = false;
                    chiseInstance.updateGraph(chiseInstance.convertSbgnmlToJson(xml), undefined, currentLayoutProperties);
                    currentGeneralProperties.inferNestingOnLoad = currentInferNestingOnLoad;
                    chiseInstance.endSpinner('paths-between-spinner');
                    $(document).trigger('sbgnvizLoadFileEnd', [ filename, cy ]);
                  }
                  else {
                    new PromptInvalidQueryView({el: '#prompt-invalidQuery-table'}).render();
                    chiseInstance.endSpinner('paths-between-spinner');
                  }
                },
                error: function(xhr, options, err){
                  new PromptInvalidQueryView({el: '#prompt-invalidQuery-table'}).render();
                  chiseInstance.endSpinner('paths-between-spinner');
                }
              });

              $(self.el).modal('toggle');

            }
            else{

              new PromptConfirmationView({el: '#prompt-confirmation-table'}).render(function(){

                chiseInstance.startSpinner('paths-between-spinner');
                var currentGeneralProperties = appUtilities.getScratch(cy, 'currentGeneralProperties');
                var currentInferNestingOnLoad = currentGeneralProperties.inferNestingOnLoad;
                var currentLayoutProperties = appUtilities.getScratch(cy, 'currentLayoutProperties'); 

                $.ajax({
                  type: 'get',
                  url: "/utilities/testURL",
                  data: {url: queryURL},
                  success: function(data){
                    if (!data.error && data.response.statusCode == 200 && data.response.body) {
                      var xml = $.parseXML(data.response.body);
                      $(document).trigger('sbgnvizLoadFile', [ filename, cy ]);
                      currentGeneralProperties.inferNestingOnLoad = false;
                      chiseInstance.updateGraph(chiseInstance.convertSbgnmlToJson(xml), undefined, currentLayoutProperties);
                      currentGeneralProperties.inferNestingOnLoad = currentInferNestingOnLoad;
                      chiseInstance.endSpinner('paths-between-spinner');
                      $(document).trigger('sbgnvizLoadFileEnd', [ filename, cy ]);
                    }
                    else {
                      new PromptInvalidQueryView({el: '#prompt-invalidQuery-table'}).render();
                      chiseInstance.endSpinner('paths-between-spinner');
                    }
                  },
                  error: function(xhr, options, err){
                    new PromptInvalidQueryView({el: '#prompt-invalidQuery-table'}).render();
                    chiseInstance.endSpinner('paths-between-spinner');
                  }
                });

                $(self.el).modal('toggle');

              });

            }

        });

        $(document).off("click", "#cancel-query-pathsbetween").on("click", "#cancel-query-pathsbetween", function (evt) {
            $(self.el).modal('toggle');
        });

        return this;
    }
});

/**
 * Paths From To Query view for the Sample Application.
 */
var PathsFromToQueryView = Backbone.View.extend({
    defaultQueryParameters: {
        sourceSymbols: "",
        targetSymbols: "",
        lengthLimit: 1
    },
    currentQueryParameters: null,
    initialize: function () {
        var self = this;
        self.copyProperties();
        self.template = _.template($("#query-pathsfromto-template").html());
        self.template = self.template(self.currentQueryParameters);
    },
    copyProperties: function () {
        this.currentQueryParameters = _.clone(this.defaultQueryParameters);
    },
    render: function () {

        var self = this;
        self.template = _.template($("#query-pathsfromto-template").html());
        self.template = self.template(self.currentQueryParameters);
        $(self.el).html(self.template);

        $(self.el).modal('show');
        PCdialog = "PathsFromTo";

        $(document).off("click", "#save-query-pathsfromto").on("click", "#save-query-pathsfromto", function (evt) {

            // use active chise instance
            var chiseInstance = appUtilities.getActiveChiseInstance();

            // use the associated cy instance
            var cy = chiseInstance.getCy();

            self.currentQueryParameters.sourceSymbols = document.getElementById("query-pathsfromto-source-symbols").value;
            self.currentQueryParameters.targetSymbols = document.getElementById("query-pathsfromto-target-symbols").value;
            self.currentQueryParameters.lengthLimit = Number(document.getElementById("query-pathsfromto-length-limit").value);

            var sourceSymbols = self.currentQueryParameters.sourceSymbols.trim();
            if (sourceSymbols.length === 0) {
                document.getElementById("query-pathsfromto-source-symbols").focus();
                return;
            }
            // sourceSymbols is cleaned up from undesired characters such as #,$,! etc. and spaces put before and after the string
            sourceSymbols = sourceSymbols.replace(/[^a-zA-Z0-9\n\t ]/g, "").trim();
            if (sourceSymbols.length === 0) {
                $(self.el).modal('toggle');
                new PromptInvalidQueryView({el: '#prompt-invalidQuery-table'}).render();
                return;
            }

            var targetSymbols = self.currentQueryParameters.targetSymbols.trim();
            if (targetSymbols.length === 0) {
                document.getElementById("query-pathsfromto-target-symbols").focus();
                return;
            }
            // targetSymbols is cleaned up from undesired characters such as #,$,! etc. and spaces put before and after the string
            targetSymbols = targetSymbols.replace(/[^a-zA-Z0-9\n\t ]/g, "").trim();
            if (targetSymbols.length === 0) {
                $(self.el).modal('toggle');
                new PromptInvalidQueryView({el: '#prompt-invalidQuery-table'}).render();
                return;
            }

            if (self.currentQueryParameters.lengthLimit > 3) {
                $(self.el).modal('toggle');
                new PromptInvalidLengthLimitView({el: '#prompt-invalidLengthLimit-table'}).render();
                document.getElementById("query-pathsfromto-length-limit").focus();
                return;
            }

            var queryURL = "http://www.pathwaycommons.org/pc2/graph?format=SBGN&kind=PATHSFROMTO&limit="
                + self.currentQueryParameters.lengthLimit;
            var sourceSymbolsArray = sourceSymbols.replaceAll("\n", " ").replaceAll("\t", " ").split(" ");
            var targetSymbolsArray = targetSymbols.replaceAll("\n", " ").replaceAll("\t", " ").split(" ");

            var filename = "";
            var sources = "";
            var targets = "";
            for (var i = 0; i < sourceSymbolsArray.length; i++) {
                var currentGeneSymbol = sourceSymbolsArray[i];
                if (currentGeneSymbol.length == 0 || currentGeneSymbol == ' '
                    || currentGeneSymbol == '\n' || currentGeneSymbol == '\t') {
                    continue;
                }
                sources = sources + "&source=" + currentGeneSymbol;

                if (filename == '') {
                    filename = currentGeneSymbol;
                } else {
                    filename = filename + '_' + currentGeneSymbol;
                }
            }
            for (var i = 0; i < targetSymbolsArray.length; i++) {
                var currentGeneSymbol = targetSymbolsArray[i];
                if (currentGeneSymbol.length == 0 || currentGeneSymbol == ' '
                    || currentGeneSymbol == '\n' || currentGeneSymbol == '\t') {
                    continue;
                }
                targets = targets + "&target=" + currentGeneSymbol;

                if (filename == '') {
                    filename = currentGeneSymbol;
                } else {
                    filename = filename + '_' + currentGeneSymbol;
                }
            }
            filename = filename + '_PATHSFROMTO.nwt';
            queryURL = queryURL + sources + targets;

            if(cy.nodes().length == 0){

              chiseInstance.startSpinner('paths-fromto-spinner');
              var currentGeneralProperties = appUtilities.getScratch(cy, 'currentGeneralProperties');
              var currentInferNestingOnLoad = currentGeneralProperties.inferNestingOnLoad;
              var currentLayoutProperties = appUtilities.getScratch(cy, 'currentLayoutProperties'); 

              $.ajax({
                type: 'get',
                url: "/utilities/testURL",
                data: {url: queryURL},
                success: function(data){
                  if (!data.error && data.response.statusCode == 200 && data.response.body) {
                    var xml = $.parseXML(data.response.body);
                    $(document).trigger('sbgnvizLoadFile', [ filename, cy ]);
                    currentGeneralProperties.inferNestingOnLoad = false;
                    chiseInstance.updateGraph(chiseInstance.convertSbgnmlToJson(xml), undefined, currentLayoutProperties);
                    currentGeneralProperties.inferNestingOnLoad = currentInferNestingOnLoad;
                    chiseInstance.endSpinner('paths-fromto-spinner');
                    $(document).trigger('sbgnvizLoadFileEnd', [ filename, cy ]);
                  }
                  else {
                    new PromptInvalidQueryView({el: '#prompt-invalidQuery-table'}).render();
                    chiseInstance.endSpinner('paths-fromto-spinner');
                  }
                },
                error: function(xhr, options, err){
                  new PromptInvalidQueryView({el: '#prompt-invalidQuery-table'}).render();
                  chiseInstance.endSpinner('paths-fromto-spinner');
                }
              });

              $(self.el).modal('toggle');

            }
            else{

              new PromptConfirmationView({el: '#prompt-confirmation-table'}).render(function(){

                chiseInstance.startSpinner('paths-fromto-spinner');
                var currentGeneralProperties = appUtilities.getScratch(cy, 'currentGeneralProperties');
                var currentInferNestingOnLoad = currentGeneralProperties.inferNestingOnLoad;
                var currentLayoutProperties = appUtilities.getScratch(cy, 'currentLayoutProperties');

                $.ajax({
                  type: 'get',
                  url: "/utilities/testURL",
                  data: {url: queryURL},
                  success: function(data){
                    if (!data.error && data.response.statusCode == 200 && data.response.body) {
                      var xml = $.parseXML(data.response.body);
                      $(document).trigger('sbgnvizLoadFile', [ filename, cy ]);
                      currentGeneralProperties.inferNestingOnLoad = false;
                      chiseInstance.updateGraph(chiseInstance.convertSbgnmlToJson(xml), undefined, currentLayoutProperties);
                      currentGeneralProperties.inferNestingOnLoad = currentInferNestingOnLoad;
                      chiseInstance.endSpinner('paths-fromto-spinner');
                      $(document).trigger('sbgnvizLoadFileEnd', [ filename, cy ]);
                    }
                    else {
                      new PromptInvalidQueryView({el: '#prompt-invalidQuery-table'}).render();
                      chiseInstance.endSpinner('paths-fromto-spinner');
                    }
                  },
                  error: function(xhr, options, err){
                    new PromptInvalidQueryView({el: '#prompt-invalidQuery-table'}).render();
                    chiseInstance.endSpinner('paths-fromto-spinner');
                  }
                });

                $(self.el).modal('toggle');

              });

            }

        });

        $(document).off("click", "#cancel-query-pathsfromto").on("click", "#cancel-query-pathsfromto", function (evt) {
            $(self.el).modal('toggle');
        });

        return this;
    }
});

/**
 * Common Stream Query view for the Sample Application.
 */
var CommonStreamQueryView = Backbone.View.extend({
    defaultQueryParameters: {
        geneSymbols: "",
        lengthLimit: 1
    },
    currentQueryParameters: null,
    initialize: function () {
        var self = this;
        self.copyProperties();
        self.template = _.template($("#query-commonstream-template").html());
        self.template = self.template(self.currentQueryParameters);
    },
    copyProperties: function () {
        this.currentQueryParameters = _.clone(this.defaultQueryParameters);
    },
    render: function () {

        var self = this;
        self.template = _.template($("#query-commonstream-template").html());
        self.template = self.template(self.currentQueryParameters);
        $(self.el).html(self.template);

        $(self.el).modal('show');
        PCdialog = "CommonStream";

        $(document).off("click", "#save-query-commonstream").on("click", "#save-query-commonstream", function (evt) {



            // use active chise instance
            var chiseInstance = appUtilities.getActiveChiseInstance();

            // use the associated cy instance
            var cy = chiseInstance.getCy();

            self.currentQueryParameters.geneSymbols = document.getElementById("query-commonstream-gene-symbols").value;
            self.currentQueryParameters.lengthLimit = Number(document.getElementById("query-commonstream-length-limit").value);

            var geneSymbols = self.currentQueryParameters.geneSymbols.trim();
            if (geneSymbols.length === 0) {
                document.getElementById("query-commonstream-gene-symbols").focus();
                return;
            }
            // geneSymbols is cleaned up from undesired characters such as #,$,! etc. and spaces put before and after the string
            geneSymbols = geneSymbols.replace(/[^a-zA-Z0-9\n\t ]/g, "").trim();
            if (geneSymbols.length === 0) {
                $(self.el).modal('toggle');
                new PromptInvalidQueryView({el: '#prompt-invalidQuery-table'}).render();
                return;
            }
            if (self.currentQueryParameters.lengthLimit > 3) {
                $(self.el).modal('toggle');
                new PromptInvalidLengthLimitView({el: '#prompt-invalidLengthLimit-table'}).render();
                document.getElementById("query-commonstream-length-limit").focus();
                return;
            }

            var queryURL = "http://www.pathwaycommons.org/pc2/graph?format=SBGN&kind=COMMONSTREAM&limit="
                + self.currentQueryParameters.lengthLimit;
            var geneSymbolsArray = geneSymbols.replaceAll("\n", " ").replaceAll("\t", " ").split(" ");

            var filename = "";
            var sources = "";
            for (var i = 0; i < geneSymbolsArray.length; i++) {
                var currentGeneSymbol = geneSymbolsArray[i];
                if (currentGeneSymbol.length == 0 || currentGeneSymbol == ' '
                    || currentGeneSymbol == '\n' || currentGeneSymbol == '\t') {
                    continue;
                }
                sources = sources + "&source=" + currentGeneSymbol;

                if (filename == '') {
                    filename = currentGeneSymbol;
                } else {
                    filename = filename + '_' + currentGeneSymbol;
                }
            }
            filename = filename + '_COMMONSTREAM.nwt';
            queryURL = queryURL + sources;

            if(cy.nodes().length == 0){

              chiseInstance.startSpinner('common-stream-spinner');
              var currentGeneralProperties = appUtilities.getScratch(cy, 'currentGeneralProperties');
              var currentInferNestingOnLoad = currentGeneralProperties.inferNestingOnLoad;
              var currentLayoutProperties = appUtilities.getScratch(cy, 'currentLayoutProperties');             

              $.ajax({
                type: 'get',
                url: "/utilities/testURL",
                data: {url: queryURL},
                success: function(data){
                  if (!data.error && data.response.statusCode == 200 && data.response.body) {
                    var xml = $.parseXML(data.response.body);
                    $(document).trigger('sbgnvizLoadFile', [ filename, cy ]);
                    currentGeneralProperties.inferNestingOnLoad = false;
                    chiseInstance.updateGraph(chiseInstance.convertSbgnmlToJson(xml), undefined, currentLayoutProperties);
                    currentGeneralProperties.inferNestingOnLoad = currentInferNestingOnLoad;
                    chiseInstance.endSpinner('common-stream-spinner');
                    $(document).trigger('sbgnvizLoadFileEnd', [ filename, cy ]);
                  }
                  else {
                    new PromptInvalidQueryView({el: '#prompt-invalidQuery-table'}).render();
                    chiseInstance.endSpinner('common-stream-spinner');
                  }
                },
                error: function(xhr, options, err){
                  new PromptInvalidQueryView({el: '#prompt-invalidQuery-table'}).render();
                  chiseInstance.endSpinner('common-stream-spinner');
                }
              });

              $(self.el).modal('toggle');

            }
            else{

              new PromptConfirmationView({el: '#prompt-confirmation-table'}).render(function(){

                chiseInstance.startSpinner('common-stream-spinner');
                var currentGeneralProperties = appUtilities.getScratch(cy, 'currentGeneralProperties');
                var currentInferNestingOnLoad = currentGeneralProperties.inferNestingOnLoad;
                var currentLayoutProperties = appUtilities.getScratch(cy, 'currentLayoutProperties');                

                $.ajax({
                  type: 'get',
                  url: "/utilities/testURL",
                  data: {url: queryURL},
                  success: function(data){
                    if (!data.error && data.response.statusCode == 200 && data.response.body) {
                      var xml = $.parseXML(data.response.body);
                      $(document).trigger('sbgnvizLoadFile', [ filename, cy ]);
                      currentGeneralProperties.inferNestingOnLoad = false;
                      chiseInstance.updateGraph(chiseInstance.convertSbgnmlToJson(xml), undefined, currentLayoutProperties);
                      currentGeneralProperties.inferNestingOnLoad = currentInferNestingOnLoad;
                      chiseInstance.endSpinner('common-stream-spinner');
                      $(document).trigger('sbgnvizLoadFileEnd', [ filename, cy ]);
                    }
                    else {
                      new PromptInvalidQueryView({el: '#prompt-invalidQuery-table'}).render();
                      chiseInstance.endSpinner('common-stream-spinner');
                    }
                  },
                  error: function(xhr, options, err){
                    new PromptInvalidQueryView({el: '#prompt-invalidQuery-table'}).render();
                    chiseInstance.endSpinner('common-stream-spinner');
                  }
                });

                $(self.el).modal('toggle');

              });

            }
        });

        $(document).off("click", "#cancel-query-commonstream").on("click", "#cancel-query-commonstream", function (evt) {
            $(self.el).modal('toggle');
        });

        return this;
    }
});
/**
 * Paths By URI Query view for the Sample Application.
 */
var PathsByURIQueryView = Backbone.View.extend({
  defaultQueryParameters: {
      URI: ""
  },
  currentQueryParameters: null,
  initialize: function () {
    var self = this;
    self.copyProperties();
    self.template = _.template($("#query-pathsbyURI-template").html());
    self.template = self.template(self.currentQueryParameters);
  },
  copyProperties: function () {
    this.currentQueryParameters = _.clone(this.defaultQueryParameters);
  },
  render: function () {
    var self = this;
    self.template = _.template($("#query-pathsbyURI-template").html());
    self.template = self.template(self.currentQueryParameters);
    $(self.el).html(self.template);

    $(self.el).modal('show');

    $(document).off("click", "#save-query-pathsbyURI").on("click", "#save-query-pathsbyURI", function (evt) {



      // use the active chise instance
      var chiseInstance = appUtilities.getActiveChiseInstance();

      // use the associated cy instance
      var cy = chiseInstance.getCy();

      self.currentQueryParameters.URI = document.getElementById("query-pathsbyURI-URI").value;
      var uri = self.currentQueryParameters.URI.trim();

      if (uri.length === 0) {
          document.getElementById("query-pathsbyURI-URI").focus();
          return;
      }
      // uri is cleaned up from undesired characters such as #,$,! etc. and spaces put before and after the string
      uri = uri.replace(/[^a-zA-Z0-9:/.\-\n\t ]/g, "").trim();
      if (uri.length === 0) {
          $(self.el).modal('toggle');
          new PromptInvalidURIView({el: '#prompt-invalidURI-table'}).render();
          return;
      }

      var queryURL = "http://www.pathwaycommons.org/pc2/get?uri="
          + uri + "&format=SBGN";

      var filename = "";

      if (filename == '') {
          filename = uri;
      } else {
          filename = filename + '_' + uri;
      }

      filename = filename + '_URI.nwt';

      if(cy.nodes().length == 0){

        chiseInstance.startSpinner('paths-byURI-spinner');
        var currentGeneralProperties = appUtilities.getScratch(cy, 'currentGeneralProperties');
        var currentInferNestingOnLoad = currentGeneralProperties.inferNestingOnLoad;
        var currentLayoutProperties = appUtilities.getScratch(cy, 'currentLayoutProperties');        

        $.ajax({
          type: 'get',
          url: "/utilities/testURL",
          data: {url: queryURL},
          success: function(data){
            if (!data.error && data.response.statusCode == 200 && data.response.body) {
              var xml = $.parseXML(data.response.body);
              $(document).trigger('sbgnvizLoadFile', [ filename, cy ]);
              currentGeneralProperties.inferNestingOnLoad = false;
              chiseInstance.updateGraph(chiseInstance.convertSbgnmlToJson(xml), undefined, currentLayoutProperties);
              currentGeneralProperties.inferNestingOnLoad = currentInferNestingOnLoad;
              chiseInstance.endSpinner('paths-byURI-spinner');
              $(document).trigger('sbgnvizLoadFileEnd', [ filename, cy ]);
            }
            else {
              new PromptInvalidURIView({el: '#prompt-invalidURI-table'}).render();
              chiseInstance.endSpinner('paths-byURI-spinner');
            }
          },
          error: function(xhr, options, err){
            new PromptInvalidURIView({el: '#prompt-invalidURI-table'}).render();
            chiseInstance.endSpinner('paths-byURI-spinner');
          }
        });

        $(self.el).modal('toggle');

      }
      else{

        new PromptConfirmationView({el: '#prompt-confirmation-table'}).render(function(){

          chiseInstance.startSpinner('paths-byURI-spinner');
          var currentGeneralProperties = appUtilities.getScratch(cy, 'currentGeneralProperties');
          var currentInferNestingOnLoad = currentGeneralProperties.inferNestingOnLoad;
          var currentLayoutProperties = appUtilities.getScratch(cy, 'currentLayoutProperties');          

          $.ajax({
            type: 'get',
            url: "/utilities/testURL",
            data: {url: queryURL},
            success: function(data){
              if (!data.error && data.response.statusCode == 200 && data.response.body) {
                var xml = $.parseXML(data.response.body);
                $(document).trigger('sbgnvizLoadFile', [ filename, cy ]);
                currentGeneralProperties.inferNestingOnLoad = false;
                chiseInstance.updateGraph(chiseInstance.convertSbgnmlToJson(xml), undefined, currentLayoutProperties);
                currentGeneralProperties.inferNestingOnLoad = currentInferNestingOnLoad;
                chiseInstance.endSpinner('paths-byURI-spinner');
                $(document).trigger('sbgnvizLoadFileEnd', [ filename, cy ]);
              }
              else {
                new PromptInvalidURIView({el: '#prompt-invalidURI-table'}).render();
                chiseInstance.endSpinner('paths-byURI-spinner');
              }
            },
            error: function(xhr, options, err){
              new PromptInvalidURIView({el: '#prompt-invalidURI-table'}).render();
              chiseInstance.endSpinner('paths-byURI-spinner');
            }
          });

          $(self.el).modal('toggle');

        });

      }

  });

    $(document).off("click", "#cancel-query-pathsbyURI").on("click", "#cancel-query-pathsbyURI", function (evt) {
        $(self.el).modal('toggle');
    });

    return this;
  }
});

/*
  There was a side effect of using this modal prompt when clicking on New.
  If the user would click on save, then the save box asking for the filename (FileSaveView) would appear
  but the map was already wiped at this point, so after setting the filename and clicking on save
  the user would end up saving an empty map.
  So this PromptSaveView isn't used for now, replaced by PromptConfirmationView.
*/
var PromptSaveView = Backbone.View.extend({

  initialize: function () {
    var self = this;
    self.template = _.template($("#prompt-save-template").html());
  },
  render: function (afterFunction) {
    var self = this;
    self.template = _.template($("#prompt-save-template").html());
    $(self.el).html(self.template);

    $(self.el).modal('show');

    $(document).off("click", "#prompt-save-accept").on("click", "#prompt-save-accept", function (evt) {
      $("#save-as-sbgnml").trigger('click');
      afterFunction();
      $(self.el).modal('toggle');
    });

    $(document).off("click", "#prompt-save-reject").on("click", "#prompt-save-reject", function (evt) {
      afterFunction();
      $(self.el).modal('toggle');
    });

    $(document).off("click", "#prompt-save-cancel").on("click", "#prompt-save-cancel", function (evt) {
      $(self.el).modal('toggle');
    });

    return this;
  }
});

/*
  Ask for filename before saving and triggering the actual browser download popup.
*/
var FileSaveView = Backbone.View.extend({
  initialize: function () {
    var self = this;
    self.template = _.template($("#file-save-template").html());
  },
  /*
    possibility to use different export format here in the future
    fileformat: sbgnml
    version: for sbgnml: 0.2, 0.3
  */
  render: function (fileformat, version, text) {
    var self = this;
    self.template = _.template($("#file-save-template").html());

    $(self.el).html(self.template);
    $(self.el).modal('show');

    $("#file-save-table").keyup(function(e){
      if (e.which == 13 && $(self.el).data('bs.modal').isShown && !$("#file-save-accept").is(":focus") && !$("#file-save-cancel").is(":focus")){
        $("#file-save-accept").click();
      }
    });

    var filename = document.getElementById('file-name').innerHTML;
    var fExt;
    switch (fileformat) {
      case 'nwt':
        fExt = 'nwt';
        break;
      case 'sbgn':
        fExt = 'sbgn'
        break;
      case 'sbml':
        fExt = 'sbml'
        break;
      case 'sif':
        fExt = 'sif'
        break;
      case 'sifLayout':
        fExt = 'txt'
        break;
      case 'png':
        fExt = 'png'
        break;
      case 'jpg':
        fExt = 'jpg'
        break;
      case 'svg':
        fExt = 'svg'
        break;      
      case 'celldesigner':
      default:
        fExt = 'xml'
        break;
    }

    filename = filename.substring(0, filename.lastIndexOf('.')).concat(".").concat(fExt);
    $("#file-save-filename").val(filename);

    $(document).off("click", "#file-save-accept").on("click", "#file-save-accept", function (evt) {

      // use the active chise instance
      var chiseInstance = appUtilities.getActiveChiseInstance();
      
      // use the assocated cy instance
      var cy = chiseInstance.getCy();
      cy.elements().unselect();
      // get current general properties for cy
      var currentGeneralProperties = appUtilities.getScratch(cy, 'currentGeneralProperties');

      filename = $("#file-save-filename").val();
      // sifLayout and image export should not change the file name in UI
      if(fileformat != "sifLayout" && fileformat != "png" && fileformat != "jpg" && fileformat != "svg"){
        appUtilities.setFileContent(filename);
      }

      if(fileformat === "sbgn" || fileformat === "nwt") {
        var renderInfo;
        var properties = jquery.extend(true, {}, currentGeneralProperties);
        delete properties.mapType; // already stored in sbgn file, no need to store in extension as property

        var saveAsFcn = chiseInstance.saveAsNwt;
        if ( fileformat === "sbgn" ) {
          saveAsFcn = chiseInstance.saveAsSbgnml;
        }

        var nodes, edges;

        if ( fileformat === "sbgn" ) {
          if (chiseInstance.elementUtilities.mapType === 'SIF') {
            properties.mapType = 'Unknown';
          }

          nodes = cy.nodes().filter( function( node ) {
            return !chiseInstance.elementUtilities.isSIFNode( node );
          } );

          edges = cy.edges().filter( function( edge ) {
            return !chiseInstance.elementUtilities.isSIFEdge( edge )
              && !chiseInstance.elementUtilities.isSIFNode( edge.data('source') )
              && !chiseInstance.elementUtilities.isSIFNode( edge.data('target') );
          } );
        }
        
        else if ( chiseInstance.elementUtilities.mapType === 'SIF' && properties.enableSIFTopologyGrouping ) {
          
          // get nodes and edges
          
          edges = cy.edges();
          var topologyGrouping = chiseInstance.sifTopologyGrouping;
          var metaEdges = topologyGrouping.getMetaEdges();
          metaEdges.forEach( function( edge ) {
            edges = edges.union( edge.data('tg-to-restore') );
          } );
          
          nodes = cy.nodes();
        }
        
        renderInfo = appUtilities.getAllStyles(cy, nodes, edges);

        // If the version is plain, exclude all extensions
        if (version === "plain") {
          saveAsFcn(filename, version, undefined, undefined, nodes, edges);
        }
        // If the version is plain3, write renderInfo but not map properties
        // which are specific to newt
        else if (version === "plain3") {
          saveAsFcn(filename, version, renderInfo, undefined, nodes, edges);
        }
        else {
          saveAsFcn(filename, version, renderInfo, properties, nodes, edges);
        }
      } 
      else if(fileformat === "celldesigner") {
       
        chiseInstance.saveAsCellDesigner(filename, function(){
          var promptFileConversionErrorView  = new PromptFileConversionErrorView({el: '#prompt-fileConversionError-table'});
          promptFileConversionErrorView.render();             
          document.getElementById("file-conversion-error-message").innerText = "Conversion service is not available!";              
        });
       
      }
      else if(fileformat === "sbml")
      {
        chiseInstance.saveAsSbml(filename, function(data,errorMessage){
        
          var promptSbmlConversionErrorView  = new PromptSbmlConversionErrorView({el: '#prompt-sbmlConversionError-table'});
          promptSbmlConversionErrorView.render(data,errorMessage);             
          //document.getElementById("file-conversion-error-message").innerText = "Conversion service is not available!";              
        });
     
      }
      else if(fileformat === "sif")
      {
        chiseInstance.saveAsPlainSif( filename, true );     
      }
      else if(fileformat === "sifLayout")
      {
        chiseInstance.exportLayoutData( filename, true );     
      }
      else if(fileformat === "png")
      {
        chiseInstance.saveAsPng(filename);    
      }
      else if(fileformat === "jpg")
      {
        chiseInstance.saveAsJpg(filename);     
      }
      else if(fileformat === "svg")
      {
        chiseInstance.saveAsSvg(filename);     
      }        
      else { // invalid file format provided
        console.error("FileSaveView received unsupported file format: "+fileformat);
      }

      $(self.el).modal('toggle');
    });

    $(document).off("click", "#file-save-cancel").on("click", "#file-save-cancel", function (evt) {
      $(self.el).modal('toggle');
    });

    return this;
  }
});

/*
  User Preferences View (Style, Map Properties, Layout etc)
*/
var SaveUserPreferencesView = Backbone.View.extend({
  initialize: function () {
    var self = this;
    self.template = _.template($("#save-user-preferences-template").html());
  },
  
  render: function () {
    var self = this;
    self.template = _.template($("#save-user-preferences-template").html());
    var param ={};
    var stagedObjects = [];
    if (typeof appUtilities.stagedElementStyles !== 'undefined') {
      appUtilities.stagedElementStyles.forEach(function(item, index){
        stagedObjects.push(item["element"]); 
      });
    }    
    param.stagedObjects = stagedObjects;
    self.template = self.template(param);
    $(self.el).html(self.template);
    $(self.el).modal('show');

    $("#user-preferences-save-table").keyup(function(e){
      if (e.which == 13 && $(self.el).data('bs.modal').isShown && !$("#save-user-preferences-accept").is(":focus") && !$("#save-user-preferences-cancel").is(":focus")){
        $("#save-user-preferences-accept").click();
      }
    });

    var filename = document.getElementById('file-name').innerHTML; 
    if(filename.lastIndexOf('.') != -1){
      filename = filename.substring(0, filename.lastIndexOf('.'));    
    }    
    filename = filename.concat(".newtp");

    $("#save-user-preferences-filename").val(filename);
    $("#save-user-prefrences-object-check").off('change').on("change", function(){
      if(document.getElementById("save-user-prefrences-object-check").checked){
          $(".save-preferences-object-styles").prop("checked", true);
          $(".save-preferences-object-styles").attr('disabled','disabled');
      }else{
        $(".save-preferences-object-styles").prop("checked", false);
   
        $(".save-preferences-object-styles").removeAttr('disabled');
      }


    });

    $(document).off("click", "#save-user-preferences-accept").on("click", "#save-user-preferences-accept", function (evt) {

       // use active chise instance
      var chiseInstance = appUtilities.getActiveChiseInstance();

      // use the associated cy instance
      var cy = appUtilities.getActiveCy();
      var preferences = {};
      //get grid properties
      if(document.getElementById("user-prefrences-grid-check").checked){
        var currentGridProperties = appUtilities.getScratch(cy, 'currentGridProperties');        
        preferences.currentGridProperties = currentGridProperties;
      }

      // get currentGeneralProperties for cy
      if(document.getElementById("user-prefrences-map-check").checked){
        preferences.currentGeneralProperties = {}
        var currentGeneralProperties = appUtilities.getScratch(cy, 'currentGeneralProperties');
      
        Object.keys(currentGeneralProperties).forEach(function(key,index) {
          if(currentGeneralProperties[key] !== appUtilities.defaultGeneralProperties[key]){
            preferences.currentGeneralProperties[key] = currentGeneralProperties[key];
          }          
      });

      delete preferences.currentGeneralProperties.mapName;
      delete preferences.currentGeneralProperties.mapDescription;
      }

      if(document.getElementById("user-prefrences-layout-check").checked){
        preferences.currentLayoutProperties = {}
        var currentLayoutProperties = appUtilities.getScratch(cy, 'currentLayoutProperties');
       
        Object.keys(currentLayoutProperties).forEach(function(key,index) {
         
            preferences.currentLayoutProperties[key] = currentLayoutProperties[key];
                  
      });
       
   
      }

      preferences.elementsStyles = [];
      if (typeof appUtilities.stagedElementStyles !== 'undefined') {
        
        appUtilities.stagedElementStyles.forEach(function(element){
          if(document.getElementById("user-prefrences-object-"+element['element']+"-check").checked){
            preferences.elementsStyles.push(element);
          }        
        });
      }     
     
      var blob = new Blob([JSON.stringify(preferences, null, 2)], {type: "application/json"});
      filename = $("#save-user-preferences-filename").val(); 
      FileSaver.saveAs(blob, filename);    
      $(self.el).modal('toggle');
    });

    $(document).off("click", "#save-user-preferences-cancel").on("click", "#save-user-preferences-cancel", function (evt) {
      $(self.el).modal('toggle');
    });
    return this;
  }
});

var LoadUserPreferencesView = Backbone.View.extend({
  initialize: function () {
    var self = this;
    self.template = _.template($("#load-user-preferences-template").html());
  },  
  render: function (param) {
    var self = this;
    self.template = _.template($("#load-user-preferences-template").html());   
    self.template = self.template(param);
    $(self.el).html(self.template);
    $(self.el).modal('show');

    $("#user-preferences-load-table").keyup(function(e){
      if (e.which == 13 && $(self.el).data('bs.modal').isShown && !$("#load-user-preferences-accept").is(":focus") && !$("#load-user-preferences-cancel").is(":focus")){
        $("#load-user-preferences-accept").click();
      }
    });   
    $("#load-user-prefrences-object-check").off('change').on("change", function(){
      if(document.getElementById("load-user-prefrences-object-check").checked){
          $(".load-preferences-object-styles").prop("checked", true);
          $(".load-preferences-object-styles").attr('disabled','disabled');
      }else{
        $(".load-preferences-object-styles").prop("checked", false);
   
        $(".load-preferences-object-styles").removeAttr('disabled');
      }
    });
    $(document).off("click", "#load-user-preferences-accept").on("click", "#load-user-preferences-accept", function (evt) {
      var preferences = appUtilities.loadedUserPreferences;
      var cy = appUtilities.getActiveCy();
      var chiseInstance = appUtilities.getActiveChiseInstance();

      //apply grid properties if check
      if(document.getElementById("load-user-prefrences-grid-check").checked){
        if(typeof preferences.currentGridProperties !== 'undefined'){
          var currentGridProperties = appUtilities.getScratch(cy, 'currentGridProperties');    
          $.extend( currentGridProperties, preferences.currentGridProperties);         
          appUtilities.setScratch(cy, currentGridProperties, 'currentGridProperties');    

          cy.gridGuide({
            drawGrid: currentGridProperties.showGrid,
            gridColor: currentGridProperties.gridColor,
            snapToGridOnRelease: currentGridProperties.snapToGridOnRelease,
            snapToGridDuringDrag: currentGridProperties.snapToGridDuringDrag,
            snapToAlignmentLocationOnRelease: currentGridProperties.snapToAlignmentLocationOnRelease,
            snapToAlignmentLocationDuringDrag: currentGridProperties.snapToAlignmentLocationDuringDrag,
            gridSpacing: currentGridProperties.gridSize,
            resize: currentGridProperties.autoResizeNodes,
            geometricGuideline: currentGridProperties.showGeometricGuidelines,
            distributionGuidelines: currentGridProperties.showDistributionGuidelines,
            initPosAlignment: currentGridProperties.showInitPosAlignment,
            guidelinesTolerance: currentGridProperties.guidelineTolerance,
            guidelinesStyle: {
              initPosAlignmentLine: currentGridProperties.initPosAlignmentLine,
              lineDash: currentGridProperties.lineDash,
              horizontalDistLine: currentGridProperties.horizontalDistLine,
              verticalDistLine: currentGridProperties.verticalDistLine,
              strokeStyle: currentGridProperties.guidelineColor,
              horizontalDistColor: currentGridProperties.horizontalGuidelineColor,
              verticalDistColor: currentGridProperties.verticalGuidelineColor,
              initPosAlignmentColor: currentGridProperties.initPosAlignmentColor,
              geometricGuidelineRange: currentGridProperties.geometricAlignmentRange,
              range: currentGridProperties.distributionAlignmentRange
            }
          });         
        }
      }           
      //apply layout properties if checked by user
      if(document.getElementById("load-user-prefrences-layout-check").checked){
        if(typeof preferences.currentLayoutProperties !== 'undefined'){
          var currentLayoutProperties = appUtilities.getScratch(cy, 'currentLayoutProperties');    
          $.extend( currentLayoutProperties, preferences.currentLayoutProperties);         
          appUtilities.setScratch(cy, currentLayoutProperties, 'currentLayoutProperties');    
          $(document).trigger('saveLayout', cy);
        }
      }      
      //apply map properties if checked by user
      if(document.getElementById("load-user-prefrences-map-check").checked){
        if(typeof preferences.currentGeneralProperties !== 'undefined'){
          var ur = cy.undoRedo();
          var actions = [];  

          Object.keys( mapTabGeneralPanel.params).forEach(function(key,index) {
            if(typeof preferences.currentGeneralProperties[key] !== 'undefined'){
              mapTabGeneralPanel.params[key].value = preferences.currentGeneralProperties[key];
              actions.push({name: "changeMenu", param: mapTabGeneralPanel.params[key]});

              if(key == "arrowScale"){              
                actions.push({name: "changeCss", param: { eles: cy.edges(), name: "arrow-scale", valueMap: mapTabGeneralPanel.params.arrowScale.value}});
              }
            }          
        });         
  
          Object.keys( mapTabLabelPanel.params).forEach(function(key,index) {
            if(typeof preferences.currentGeneralProperties[key] !== 'undefined'){
              mapTabLabelPanel.params[key].value = preferences.currentGeneralProperties[key];              
                actions.push({name: "changeMenu", param: mapTabLabelPanel.params[key]});            
            }          
        });
        
 
          Object.keys( mapTabRearrangementPanel.params).forEach(function(key,index) {
            if(typeof preferences.currentGeneralProperties[key] !== 'undefined'){
              mapTabRearrangementPanel.params[key].value = preferences.currentGeneralProperties[key];              
                actions.push({name: "changeMenu", param: mapTabRearrangementPanel.params[key]});            
            }          
        });
 
          
          var applyColorScheme = false;
          var defaultColorScheme = appUtilities.defaultGeneralProperties.mapColorScheme;
          var defaultColorSchemeStyle = appUtilities.defaultGeneralProperties.mapColorSchemeStyle;
          if(typeof preferences.currentGeneralProperties.mapColorScheme !== 'undefined'){
            applyColorScheme = true;
           defaultColorScheme = preferences.currentGeneralProperties.mapColorScheme;          
          }

          if(typeof preferences.currentGeneralProperties.mapColorSchemeStyle !== 'undefined'){
            applyColorScheme = true;
            defaultColorSchemeStyle = preferences.currentGeneralProperties.mapColorSchemeStyle;          
          }
          if(applyColorScheme){
            appUtilities.applyMapColorScheme(defaultColorScheme, defaultColorSchemeStyle, colorSchemeInspectorView); // default color scheme
          }
          ur.do("batch", actions);  
        }  
      }        
      
      
      if(typeof preferences.elementsStyles !== 'undefined'){        
        preferences.elementsStyles.forEach(function(item, index){
          var sbgnClass = item["element"];
          if(document.getElementById("load-user-prefrences-object-"+sbgnClass+"-check").checked){
            var targetNodes =cy.elements('[class="' + sbgnClass + '"]')
            if(item.styles.length > 0){
              var nameToValue = {};
              item.styles.forEach(function(style, index){
                nameToValue[style.name] = style.value;
              });
  
              //apply changes to exisiting elements only if user check the option and there are elements on canvas of this sbgn class type
              //else just set the styles as default values 
              if(targetNodes.length > 0 && document.getElementById("load-user-prefrences-apply-changes").checked)
              {
  
                if(item['type'] == 'node')
                {
                   // apply node width and height change to existing elements              
                  targetNodes.forEach(function(node) {
                    cy.trigger('nodeediting.resizestart', [null, node]);
                    chiseInstance.resizeNodes(node, nameToValue["width"], nameToValue["height"], false);
                    cy.trigger('nodeediting.resizeend', [null, node]);
                  });
                  
                  chiseInstance.changeData(targetNodes, "border-color", nameToValue["border-color"]);
                  chiseInstance.changeData(targetNodes, "border-width", nameToValue["border-width"]);
                  chiseInstance.changeData(targetNodes, "background-color",  nameToValue["background-color"]);
  
                  //hande opacity
                  chiseInstance.changeData(targetNodes, "background-opacity",  nameToValue["background-opacity"]);
                  chiseInstance.changeData(targetNodes, "background-image-opacity",  nameToValue["background-image-opacity"]);
  
                  //handel font
                  var data = {};            
                  data['font-size'] = nameToValue['font-size'] != '' ? nameToValue['font-size'] : undefined;
                  data['font-family'] = nameToValue['font-sifamilyze'] != '' ? nameToValue['font-family'] : undefined;
                  data['font-weight'] = nameToValue['font-weight'] != '' ? nameToValue['font-weight'] : undefined;
                  data['font-style'] = nameToValue['font-style'] != '' ? nameToValue['font-style'] : undefined;
                  data['color'] = nameToValue['color'] != '' ? nameToValue['color'] : undefined; 
                  chiseInstance.changeFontProperties(targetNodes, data);
  
                  targetNodes.forEach(function(node) {
                    node.data('background-image', nameToValue['background-image']);
                    node.data('background-position-x', nameToValue['background-position-x']);
                    node.data('background-position-y', nameToValue['background-position-y']);
                    node.data('background-width', nameToValue['background-width']);
                    node.data('background-height', nameToValue['background-height']);
                    node.data('background-fit', nameToValue['background-fit']);
                    node.data('background-image-opacity', nameToValue['background-image-opacity']);
                  });
  
                  chiseInstance.setMultimerStatus(targetNodes,nameToValue['multimer'] );
                  chiseInstance.setCloneMarkerStatus(targetNodes,nameToValue['clonemarker'] ); 
                }
                else
                {
                  //if type is edge only apply width and line-color
                  chiseInstance.changeData(targetNodes, "width", nameToValue['width']);
                  chiseInstance.changeData(targetNodes, "line-color", nameToValue['line-color']);
                }             
              }
              //set the loaded styles as default values
              chiseInstance.elementUtilities.setDefaultProperties( sbgnClass, nameToValue );
  
  
            
  
            }

            if(item.infoBoxStyles && item.infoBoxStyles.length > 0){
                //set info boxes styles 
              var infoStyles =  item.infoBoxStyles;
  
             
              infoStyles.forEach(function(infoStyle){
  
                var currentDefaults = chiseInstance.elementUtilities.getDefaultProperties( sbgnClass )[ infoStyle.clazz ];
                var infoboxStyle = $.extend( {}, currentDefaults, infoStyle.styles );
                chiseInstance.setDefaultProperty( sbgnClass, infoStyle.clazz, infoboxStyle );
  
                //statesandinfos

                if(targetNodes.length > 0 && document.getElementById("load-user-prefrences-apply-changes").checked){
                  targetNodes.forEach(function(node) {
                    var infoboxesIndices = node.data("statesandinfos").length;
                    for(var i = 0 ; i< infoboxesIndices ; i++){
                      if(node.data('statesandinfos')[i].clazz == infoStyle.clazz){
                        appUtilities.getActiveChiseInstance().updateInfoboxStyle(node, i, infoboxStyle);    
                      }
    
                    }
                  });
                } 
              });
      
            }  
         
        }
        });
      }
    
       
      $(self.el).modal('toggle');
    });

    $(document).off("click", "#load-user-preferences-cancel").on("click", "#load-user-preferences-cancel", function (evt) {
      $(self.el).modal('toggle');
    });
    return this;
  }
});

/*
  Simple Yes/No confirmation modal box. See PromptSaveView.
*/
var PromptConfirmationView = Backbone.View.extend({
  initialize: function () {
    var self = this;
    self.template = _.template($("#prompt-confirmation-template").html());
  },
  render: function (afterFunction) {
    var self = this;
    self.template = _.template($("#prompt-confirmation-template").html());

    $(self.el).html(self.template);
    $(self.el).modal('show');

    $(document).off("click", "#prompt-confirmation-accept").on("click", "#prompt-confirmation-accept", function (evt) {
      afterFunction();
      $(self.el).modal('toggle');
    });

    $(document).off("click", "#prompt-confirmation-cancel").on("click", "#prompt-confirmation-cancel", function (evt) {
      $(self.el).modal('toggle');
    });

    return this;
  }
});

var PromptMapTypeView = Backbone.View.extend({
  initialize: function () {
    var self = this;
    self.template = _.template($("#prompt-mapType-template").html());
  },
  render: function (message,suggestion, afterFunction) {
    var self = this;
    self.template = _.template($("#prompt-mapType-template").html());

    var param = {};
    param.message = message;
    param.suggestion =suggestion;
    self.template = self.template(param);

    $(self.el).html(self.template);
    $(self.el).modal('show');

    $(document).off("click", "#prompt-mapType-accept").on("click", "#prompt-mapType-accept", function (evt) {
      //afterFunction();
      $(self.el).modal('toggle');
    });

    $(document).off("click", "#prompt-mapType-cancel").on("click", "#prompt-mapType-cancel", function (evt) {
      $(self.el).modal('toggle');
    });

    return this;
  }
});

var PromptInvalidQueryView = Backbone.View.extend({
  initialize: function () {
      var self = this;
      self.template = _.template($("#prompt-invalidQuery-template").html());
  },
  render: function () {
      var self = this;
      self.template = _.template($("#prompt-invalidQuery-template").html());

      $(self.el).html(self.template);
      $(self.el).modal('show');

      $(document).off("click", "#prompt-invalidQuery-confirm").on("click", "#prompt-invalidQuery-confirm", function (evt) {
          $(self.el).modal('toggle');
          if (PCdialog == "Neighborhood")
            appUtilities.neighborhoodQueryView.render();
          else if (PCdialog == "PathsBetween")
              appUtilities.pathsBetweenQueryView.render();
          else if (PCdialog == "PathsFromTo")
              appUtilities.pathsFromToQueryView.render();
          else if (PCdialog == "CommonStream")
              appUtilities.commonStreamQueryView.render();
      });

      return this;
  }
});

var PromptEmptyQueryResultView = Backbone.View.extend({
  initialize: function () {
      var self = this;
      self.template = _.template($("#prompt-emptyQueryResult-template").html());
  },
  render: function () {
      var self = this;
      self.template = _.template($("#prompt-emptyQueryResult-template").html());

      $(self.el).html(self.template);
      $(self.el).modal('show');

      $(document).off("click", "#prompt-emptyQueryResult-confirm").on("click", "#prompt-emptyQueryResult-confirm", function (evt) {
        $(self.el).modal('toggle');
      });

      return this;
  }
});

var PromptInvalidLengthLimitView = Backbone.View.extend({
    initialize: function () {
        var self = this;
        self.template = _.template($("#prompt-invalidLengthLimit-template").html());
    },
    render: function () {
        var self = this;
        self.template = _.template($("#prompt-invalidLengthLimit-template").html());

        $(self.el).html(self.template);
        if (PCdialog == "Neighborhood")
          document.getElementById("length-limit-constant").innerHTML = "Length limit can be at most 2.";								  
        else
            document.getElementById("length-limit-constant").innerHTML = "Length limit can be at most 3.";
        $(self.el).modal('show');

        $(document).off("click", "#prompt-invalidLengthLimit-confirm").on("click", "#prompt-invalidLengthLimit-confirm", function (evt) {
            $(self.el).modal('toggle');
            if (PCdialog == "Neighborhood")
                appUtilities.neighborhoodQueryView.render();
            else if (PCdialog == "PathsBetween")
                appUtilities.pathsBetweenQueryView.render();
            else if (PCdialog == "PathsFromTo")
                appUtilities.pathsFromToQueryView.render();
            else if (PCdialog == "CommonStream")
                appUtilities.commonStreamQueryView.render();
			     				  
        });

        return this;
    }
});

var PromptInvalidURIView = Backbone.View.extend({
    initialize: function () {
        var self = this;
        self.template = _.template($("#prompt-invalidURI-template").html());
    },
    render: function () {
        var self = this;
        self.template = _.template($("#prompt-invalidURI-template").html());

        $(self.el).html(self.template);
        $(self.el).modal('show');

        $(document).off("click", "#prompt-invalidURI-confirm").on("click", "#prompt-invalidURI-confirm", function (evt) {
            $(self.el).modal('toggle');
            appUtilities.pathsByURIQueryView.render();
        });

        return this;
    }
});

var PromptInvalidURIWarning = Backbone.View.extend({
    initialize: function () {
        var self = this;
        self.template = _.template($("#prompt-invalidURI-template").html());
    },
    render: function () {
        var self = this;
        self.template = _.template($("#prompt-invalidURI-template").html());

        $(self.el).html(self.template);
        $(self.el).modal('show');

        $(document).off("click", "#prompt-invalidURI-confirm").on("click", "#prompt-invalidURI-confirm", function (evt) {
            $(self.el).modal('toggle');
        });

        return this;
    }
});

var PromptInvalidFileView = Backbone.View.extend({
  initialize: function () {
    var self = this;
    self.template = _.template($("#prompt-invalidFile-template").html());
  },
  render: function () {
    var self = this;
    self.template = _.template($("#prompt-invalidFile-template").html());

    $(self.el).html(self.template);
    $(self.el).modal('show');

    $(document).off("click", "#prompt-invalidFile-confirm").on("click", "#prompt-invalidFile-confirm", function (evt) {
      $(self.el).modal('toggle');
    });

    return this;
  }
});
var PromptInvalidTypeWarning = Backbone.View.extend({
  initialize: function () {
    var self = this;
    self.template = _.template($("#prompt-errorInvalidType-template").html());
  },
  render: function () {
    var self = this;
    self.template = _.template($("#prompt-errorInvalidType-template").html());

    $(self.el).html(self.template);
    $(self.el).modal('show');

    $(document).off("click", "#prompt-errorInvalidType-confirm").on("click", "#prompt-errorInvalidType-confirm", function (evt) {
      $(self.el).modal('toggle');
    });

    return this;
  }
});
var PromtErrorPD2AF = Backbone.View.extend({
  initialize: function () {
    var self = this;
    self.template = _.template($("#prompt-errorPD2AF-template").html());
  },
  render: function (message) {
    var self = this;
    self.template = _.template($("#prompt-errorPD2AF-template").html());

    var param = {};
    param.message = message;
    self.template = self.template(param);

    $(self.el).html(self.template);
    $(self.el).modal('show');

    $(document).off("click", "#prompt-errorPD2AF-confirm").on("click", "#prompt-errorPD2AF-confirm", function (evt) {
      $(self.el).modal('toggle');
    });
    return this;
  }
});
var PromptFileConversionErrorView = Backbone.View.extend({
   initialize: function () {
     var self = this;
     self.template = _.template($("#prompt-fileConversionError-template").html());
   },
   render: function() {
     var self = this;
     self.template = _.template($("#prompt-fileConversionError-template").html());

     $(self.el).html(self.template);
     $(self.el).modal('show');

     $(document).off("click", "#prompt-fileConversionError-confirm").on("click", "#prompt-fileConversionError-confirm", function (evt) {
         $(self.el).modal('toggle');
     });

     return this;
   }
});

var PromptSbmlConversionErrorView = Backbone.View.extend({
  initialize: function () {
    var self = this;
    self.template = _.template($("#prompt-sbmlConversionError-template").html());
  },
  render: function(data, errorMessage) {
    var self = this;
    self.template = _.template($("#prompt-sbmlConversionError-template").html());

    $(self.el).html(self.template);
    $(self.el).modal('show');

    $(document).off("click", "#prompt-sbml-confirm").on("click", "#prompt-sbml-confirm", function (evt) {   
      var userAgreed = document.getElementById("sbml-coversion-user-agree").checked ? true : false;
     
      if(userAgreed){
        setTimeout(function(){
        $.ajax({
          type: 'post',
          url: "/utilities/sendEmail",
          headers: {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"},
          data: { fileContent: data , message: "Error message: "+ errorMessage},            
          success: function( data ) {        
          },
          error: function(xhr, options, err){             
            console.log( err );
            
          }        })} , 0); 
      }else{
        setTimeout(function(){
          $.ajax({
            type: 'post',
            url: "/utilities/sendEmail",
            headers: {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"},
            data: { fileContent: "no-data" , message: "The user didn't consent to sharing their file." + "\nError message: " + errorMessage},            
            success: function( data ) {        
            },
            error: function(xhr, options, err){             
              console.log( err );
              
            }        })} , 0); 
      }    
      
      $(self.el).modal('toggle');
        
    });

    return this;
  }
});
var PromptInvalidURLWarning = Backbone.View.extend({
  initialize: function () {
    var self = this;
    self.template = _.template($("#prompt-invalidURL-template").html());
  },
  render: function () {
    var self = this;
    self.template = _.template($("#prompt-invalidURL-template").html());

    $(self.el).html(self.template);
    $(self.el).modal('show');

    $(document).off("click", "#prompt-invalidURL-confirm").on("click", "#prompt-invalidURL-confirm", function (evt) {
      $(self.el).modal('toggle');
    });

    return this;
  }
});

var PromptInvalidImageWarning = Backbone.View.extend({
  initialize: function () {
    var self = this;
    self.template = _.template($("#prompt-invalidImage-template").html());
  },
  render: function (msg) {
    var self = this;
    var tmp = $("#prompt-invalidImage-template").html();
    var spanText = '<span class="add-on layout-text">';
    var s = tmp.indexOf(spanText)
    var e = tmp.indexOf('</span>');
    tmp = tmp.substring(0, s + spanText.length) + msg + tmp.substring(e);
    self.template = _.template(tmp);

    $(self.el).html(self.template);
    $(self.el).modal('show');

    $(document).off("click", "#prompt-invalidImage-confirm").on("click", "#prompt-invalidImage-confirm", function (evt) {
      $(self.el).modal('toggle');
    });

    return this;
  }
});

var PromptInvalidEdgeWarning = Backbone.View.extend({
  initialize: function () {
    var self = this;
    self.template = _.template($("#prompt-invalidEdge-template").html());
  },
  render: function () {
    var self = this;
    self.template = _.template($("#prompt-invalidEdge-template").html());

    $(self.el).html(self.template);
    $(self.el).modal('show');

    $(document).off("click", "#prompt-invalidEdge-confirm").on("click", "#prompt-invalidEdge-confirm", function (evt) {
      $(self.el).modal('toggle');
    });

    return this;
  }
});

var ReactionTemplateView = Backbone.View.extend({
  updatePreview: function() {
    let self = this;
    const brickType = $("#brick-type-select").val();

    if (previewTimeout) {
      clearTimeout(previewTimeout);
    }
    var previewTimeout = setTimeout(function() {
      self.cy.remove(self.cy.elements());

      if (brickType === "metabolic-reaction") {
        const params = self.getMetabolicReactionParameters();
        self.chiseInstance.createMetabolicReaction(params.inputData, params.outputData, params.reversible, params.regulator, params.regulatorMultimer, params.orientation);
      }
      else if (brickType === "conversion") {
        const params = self.getConversionParameters();
        self.chiseInstance.createConversion(params.macromolecule, params.regulator, params.regulatorMultimer, params.orientation, params.inputInfoboxLabels, params.outputInfoboxLabels);
      }
      else if (brickType === "multimerization") {
        const params = self.getMultimerizationParameters();
        self.chiseInstance.createMultimerization(params.macromolecule, params.regulator, params.regulatorMultimer, params.orientation);
      }
      else if (brickType === "association") {
        const params = self.getAssociationParameters();
        self.chiseInstance.createComplexProteinFormation(params.inputLabels, params.complexLabel, params.regulator, params.orientation, params.reverse);
      }
      else if (brickType === "dissociation") {
        const params = self.getDissociationParameters();
        self.chiseInstance.createComplexProteinFormation(params.inputLabels, params.complexLabel, params.regulator, params.orientation, params.reverse);
      }
      else if (brickType === "degradation") {
        const params = self.getDegradationParameters();
        self.chiseInstance.createDegradation(params.macromolecule, params.orientation);
      }
      else if (brickType === "transcription") {
        const params = self.getTranscriptionParameters();
        self.chiseInstance.createTranscription(params.label, params.orientation);
      }
      else if (brickType === "translation") {
        const params = self.getTranslationParameters();
        self.chiseInstance.createTranslation(params.regulatorLabel, params.outputLabel, params.orientation);
      }
      else {
        console.error("SBGN Bricks Modal - updatePreview() - brick type not found");
      }
      const padding = 5;
      self.cy.fit(self.cy.elements(), padding);
    },500);
  },
  createDropdownElement: function(listOfOptionNames, listOfCSSClasses, listOfValues) {
    const selectElement = document.createElement('select');
    listOfOptionNames.forEach(function(name, index) {
      const optionElement = document.createElement('option');
      optionElement.innerHTML = name;
      optionElement.value = listOfValues ? listOfValues[index] : name;
      if (index === 0) {
        optionElement.selected = true;
      }

      selectElement.appendChild(optionElement);
    });
    selectElement.classList = listOfCSSClasses.join(' ');
    return selectElement;
  },
  createInputFieldElement: function(listOfCSSClasses) {
    const inputFieldElement = document.createElement('input');
    inputFieldElement.type = 'text';
    inputFieldElement.classList = listOfCSSClasses.join(' ');
    inputFieldElement.value = '';

    return inputFieldElement;
  },
  createImageElement: function(src, listOfCSSClasses) {
    const imgElement = document.createElement('img');
    imgElement.src = src;
    imgElement.classList = listOfCSSClasses.join(' ');
    
    return imgElement;
  },
  createRowElement: function(listOfDropdownOptions) {
    const tableRowElement = document.createElement('tr');
    const inputFieldTableDataElement = document.createElement('td');
    const dropdownTableDataElement = document.createElement('td');
    const imgTableDataElement = document.createElement('td');

    const dropdownCSSClasses = ['template-reaction-molecule-type', 'dropdown-sbgn-bricks-molecule-type','layout-text'];
    const dropdownElement = this.createDropdownElement(listOfDropdownOptions, dropdownCSSClasses);

    const inputFieldCSSClasses = ['template-reaction-textbox', 'sbgn-input-medium', ' layout-text'];
    const inputFieldElement = this.createInputFieldElement(inputFieldCSSClasses);

    const imgCSSClasses = ['icon-small', 'template-reaction-delete-button'];
    const deleteImgSource = 'app/img/toolbar/delete-simple.svg';
    const imgElement = this.createImageElement(deleteImgSource, imgCSSClasses);

    inputFieldTableDataElement.appendChild(inputFieldElement);
    dropdownTableDataElement.appendChild(dropdownElement);
    imgTableDataElement.appendChild(imgElement);

    tableRowElement.appendChild(inputFieldTableDataElement);
    tableRowElement.appendChild(dropdownTableDataElement);
    tableRowElement.appendChild(imgTableDataElement);

    return tableRowElement;
  },
  addInputFieldForMetabolicReaction: function () {
    const inputOptions = ["Simple Chemical"];
    const tableRowElement = this.createRowElement(inputOptions);

    const lastTableRowElement = $('#metabolic-reaction-input-table tr').last();
    $(tableRowElement).insertBefore(lastTableRowElement);
  },
  addOutputFieldForMetabolicReaction: function() {
    const outputOptions = ["Simple Chemical"]
    const tableRowElement = this.createRowElement(outputOptions);

    const lastTableRowElement = $('#metabolic-reaction-output-table tr').last();
    $(tableRowElement).insertBefore(lastTableRowElement);
  },
  addModificationForConversion: function() {
    const tableRowElement = document.createElement('tr');
    const tableDataElement = document.createElement('td');
    const dropdownCSSClasses = ['sbgn-output-medium', 'layout-text', 'conversion-type-dropdown'];
    const modificationTypes = ["Phosphorylation", "Ubiquitination", "Hydroxilation", "Acetylation",
                                  "Glycosylation", "Myristoylation","Palmitoylation","Prenylation",
                                  "Sulfation", "Methylation", "Protonation", "Activation"];
    const dropdownOptions = [];
    modificationTypes.forEach(function (type) {
      dropdownOptions.push(type);
      dropdownOptions.push("De" + type.toLowerCase());
    });
    
    const modificationSymbols = ["P", "Ub", "OH", "Ac", "G", "My", "Pa", "Pr", "S", "Me", "H"];
    const dropdownValues = [];
    modificationSymbols.forEach(function (symbol) {
      dropdownValues.push(symbol + "-out");
      dropdownValues.push(symbol + "-in");
    });
    dropdownValues.push("activation");
    dropdownValues.push("deactivation");

    const dropdownElement = this.createDropdownElement(dropdownOptions, dropdownCSSClasses, dropdownValues);

    const labelElement = document.createElement('label');
    labelElement.classList = "layout-text conversion-residue-input-label";
    labelElement.innerHTML = "Residue:";

    const inputFieldCSSClasses = ['conversion-modification-residue-name', 'sbgn-input-medium', ' layout-text', 'small-right-margin'];
    const inputFieldElement = this.createInputFieldElement(inputFieldCSSClasses);

    const imgCSSClasses = ['icon-small', 'template-reaction-delete-button'];
    const deleteImgSource = 'app/img/toolbar/delete-simple.svg';
    const imgElement = this.createImageElement(deleteImgSource, imgCSSClasses);

    tableDataElement.appendChild(dropdownElement);
    tableDataElement.appendChild(labelElement);
    tableDataElement.appendChild(inputFieldElement);
    tableDataElement.appendChild(imgElement);

    tableRowElement.appendChild(tableDataElement);

    const lastTableRowElement = $("#conversion-modification-table tr:last");
    $(tableRowElement).insertBefore(lastTableRowElement);
  },
  addAssociationInput: function() {
    const inputOptions = ["Macromolecule"];
    const tableRowElement = this.createRowElement(inputOptions);

    const lastTableRowElement = $('#association-input-table tr:last');
    $(tableRowElement).insertBefore(lastTableRowElement);
  },
  addDissociationOutput: function() {
    const inputOptions = ["Macromolecule"];
    const tableRowElement = this.createRowElement(inputOptions);

    const lastTableRowElement = $('#dissociation-output-table tr:last');
    $(tableRowElement).insertBefore(lastTableRowElement);
  },
  changeTemplateHTMLContent: function (brickType) {

    $('#reaction-template-left-td').html(this.brickMetadata[brickType]["input-side-html"]);
    $('#reaction-template-right-td').html(this.brickMetadata[brickType]["output-side-html"]);
    $('#sbgn-bricks-help-link').attr('href', this.brickMetadata[brickType]["help-link"]);
    $('#reaction-top-input-row').html(this.brickMetadata[brickType]["top-input-row"]);

    ["conversion", "multimerization"].forEach(function (type) {
      const bottomRowId = "#" + type + "-bottom-row";
      if (brickType === type) {
        $(bottomRowId).removeClass("hide");
      }
      else {
        $(bottomRowId).addClass("hide");
      }
    });
  },
  getMetabolicReactionParameters: function() {
    const inputNames = $('#metabolic-reaction-input-table  :input.template-reaction-textbox').map(function(){
      return $(this).val();
    }).toArray();

    const inputTypes = $('#metabolic-reaction-input-table  :input.template-reaction-molecule-type :selected').map(function(){
      return $(this).val();
    }).toArray();

    const outputNames = $('#metabolic-reaction-output-table  :input.template-reaction-textbox').map(function(){
      return $(this).val();
    }).toArray();

    const outputTypes = $('#metabolic-reaction-output-table  :input.template-reaction-molecule-type :selected').map(function(){
      return $(this).val();
    }).toArray();

    const inputData = [];
    inputNames.forEach(function(name, index) {
      inputData.push({
        name: name,
        type: inputTypes[index]
      });
    });

    const outputData = [];
    outputNames.forEach(function(name, index) {
      outputData.push({
        name: name,
        type: outputTypes[index]
      });
    });

    const reversible = $("#metabolic-reaction-reversible-checkbox").prop('checked');

    const hasRegulator = $("#metabolic-reaction-regulator-checkbox").prop('checked');

    const regulator = hasRegulator ? {
      name: $("#metabolic-reaction-regulator-name").val(),
      type: $("#metabolic-reaction-regulator-type").val()
    } : {};

    const multimerCardinality = this.getMultimerCardinalityValue($("#metabolic-reaction-multimer-cardinality").val());

    const multimer = {
      enabled: !$("#metabolic-reaction-multimer-checkbox").prop("disabled") &&
                $("#metabolic-reaction-multimer-checkbox").prop("checked"),
      cardinality: multimerCardinality
    };

    const orientation = $("#metabolic-reaction-orientation-select").val();

    return {
      inputData: inputData,
      outputData: outputData,
      reversible: reversible,
      regulator: regulator,
      regulatorMultimer: multimer,
      orientation: orientation
    }
  },
  getMultimerCardinalityValue: function(value) {
    const numberEquivalent = Number(value);
    if (isNaN(numberEquivalent) || Number(value) < 2 || !Number.isInteger(numberEquivalent)) {
      return "";
    }
    else {
      return numberEquivalent.toString();
    }
  },
  getConversionParameters: function() {
    const macromoleculeName = $('#conversion-input-name').val(); // input and output have same name
    const macromoleculeMultimer = $('#conversion-macromolecule-multimer-checkbox').prop('checked');
    const macromoleculeCardinality = this.getMultimerCardinalityValue($("#conversion-macromolecule-multimer-cardinality").val());

    const macromolecule = {
      name: macromoleculeName,
      multimer: {
        enabled: macromoleculeMultimer,
        cardinality: macromoleculeCardinality
      }
    }

    const conversionTypes = $('#reaction-top-input-row select.conversion-type-dropdown').map(function(){
      return $(this).val();
    }).toArray();

    const residueNames = $('#reaction-top-input-row :input.conversion-modification-residue-name').map(function(){
      return $(this).val();
    }).toArray();

    const hasRegulator = $('#conversion-regulator-checkbox').prop('checked');

    const regulator = hasRegulator ? {
      name: $('#conversion-regulator-name').val(),
      type: $('#conversion-regulator-type').val()
    } : {};

    const multimerCardinality = this.getMultimerCardinalityValue($("#conversion-multimer-cardinality").val());

    const multimer = {
      enabled: !$("#conversion-multimer-checkbox").prop("disabled") &&
                $("#conversion-multimer-checkbox").prop("checked"),
      cardinality: multimerCardinality
    };

    const orientation = $("#metabolic-reaction-orientation-select").val();

    const inputInfoboxLabels = [];
    const outputInfoboxLabels = [];

    conversionTypes.forEach(function (type, index) {
      let inputInfoboxLabel = ""; 
      let outputInfoboxLabel = "";
      const infoboxData = type.split("-");
      if (infoboxData.length < 2) {
        if (infoboxData[0] === "activation") {
          inputInfoboxLabel = "inactive";
          outputInfoboxLabel = "active";
        }
        else {
          inputInfoboxLabel = "active";
          outputInfoboxLabel = "inactive";
        }
      }
      else {
        const infoboxSymbolOnInputSide = infoboxData[1] === "in";
        const inputSymbol = infoboxSymbolOnInputSide ? infoboxData[0] : ""; 
        const outputSymbol = infoboxSymbolOnInputSide ? "" : infoboxData[0];

        const residueEnabled = !$("#conversion-residue-name").prop("disabled");
        const residue = residueNames[index];
        const residueName = residueEnabled && residue === "" ? "" : "@" + residue;

        inputInfoboxLabel = inputSymbol + residueName;
        outputInfoboxLabel = outputSymbol + residueName;
      }

      inputInfoboxLabels.push(inputInfoboxLabel);
      outputInfoboxLabels.push(outputInfoboxLabel);
    });

    return {
      macromolecule: macromolecule,
      regulator: regulator,
      regulatorMultimer: multimer,
      orientation: orientation,
      inputInfoboxLabels: inputInfoboxLabels,
      outputInfoboxLabels: outputInfoboxLabels
    };
  },
  getMultimerizationParameters: function() {
    const macromoleculeName = $('#multimerization-input-name').val(); // input and output have same name
    const macromoleculeCardinality = this.getMultimerCardinalityValue($("#multimerization-macromolecule-multimer-cardinality").val());

    const macromolecule = {
      name: macromoleculeName,
      cardinality: macromoleculeCardinality
    };

    const hasRegulator = $('#multimerization-regulator-checkbox').prop('checked');

    const regulator = hasRegulator ? {
      name: $('#multimerization-regulator-name').val(),
      type: $('#multimerization-regulator-type').val(),
      edgeType: $('#multimerization-regulator-edge-type').val()
    } : {};

    const multimerCardinality = this.getMultimerCardinalityValue($("#multimerization-multimer-cardinality").val());

    const regulatorMultimer = {
      enabled: !$("#multimerization-multimer-checkbox").prop("disabled") &&
                $("#multimerization-multimer-checkbox").prop("checked"),
      cardinality: multimerCardinality
    };

    const orientation = $("#metabolic-reaction-orientation-select").val();

    return {
      macromolecule: macromolecule,
      regulator: regulator,
      regulatorMultimer: regulatorMultimer,
      orientation: orientation
    };
  },
  getAssociationParameters: function() {
    const inputLabels = $('#sbgn-brick-middle-row #association-input-table :input.template-reaction-textbox').map(function(){
      return $(this).val();
    }).toArray();

    const complexLabel = $("#association-complex-name").val();

    const hasRegulator = $('#association-regulator-checkbox').prop('checked');

    const multimerCardinality = this.getMultimerCardinalityValue($("#association-multimer-cardinality").val());

    const regulator = hasRegulator ? {
      name: $('#association-regulator-name').val(),
      type: $('#association-regulator-type').val(),
      edgeType: $('#association-regulator-edge-type').val(),
      multimer: {
        enabled: !$("#association-multimer-checkbox").prop("disabled") &&
                $("#association-multimer-checkbox").prop("checked"),
        cardinality: multimerCardinality
      }
    } : {};

    const orientation = $("#metabolic-reaction-orientation-select").val();

    return {
      inputLabels: inputLabels,
      complexLabel: complexLabel,
      regulator: regulator,
      orientation: orientation,
      reverse: false
    }
  },
  getDissociationParameters: function() {
    const inputLabels = $('#sbgn-brick-middle-row #dissociation-output-table :input.template-reaction-textbox').map(function(){
      return $(this).val();
    }).toArray();

    const complexLabel = $("#dissociation-complex-name").val();

    const hasRegulator = $('#dissociation-regulator-checkbox').prop('checked');

    const multimerCardinality = this.getMultimerCardinalityValue($("#dissociation-multimer-cardinality").val());

    const regulator = hasRegulator ? {
      name: $('#dissociation-regulator-name').val(),
      type: $('#dissociation-regulator-type').val(),
      edgeType: $('#dissociation-regulator-edge-type').val(),
      multimer: {
        enabled: !$("#dissociation-multimer-checkbox").prop("disabled") &&
                $("#dissociation-multimer-checkbox").prop("checked"),
        cardinality: multimerCardinality
      }
    } : {};

    const orientation = $("#metabolic-reaction-orientation-select").val();

    return {
      inputLabels: inputLabels,
      complexLabel: complexLabel,
      regulator: regulator,
      orientation: orientation,
      reverse: true
    }
  },
  getDegradationParameters: function() {
    const macromolecule = {
      name: $("#degradation-input-name").val()
    };

    const orientation = $("#metabolic-reaction-orientation-select").val();

    return {
      macromolecule: macromolecule,
      orientation: orientation
    }
  },
  getTranscriptionParameters: function() {
    const label = $("#transcription-regulator-name").val();
    const orientation = $("#metabolic-reaction-orientation-select").val();

    return {
      label: label,
      orientation: orientation
    }
  },
  getTranslationParameters: function() {
    const regulatorLabel = $("#translation-regulator-name").val();
    const outputLabel = $("#translation-output-name").val();
    const orientation = $("#metabolic-reaction-orientation-select").val();

    return {
      regulatorLabel: regulatorLabel,
      outputLabel: outputLabel,
      orientation: orientation
    }
  },
  enableImageButtons: function(jQueryElements) {
    jQueryElements.removeClass("image-button-disabled-appearance")
                  .addClass("image-button-enabled-appearance");
  },
  disableImageButtons: function(jQueryElements) {
    jQueryElements.removeClass("image-button-enabled-appearance")
                  .addClass("image-button-disabled-appearance");
  },
  setMultimerCheckboxEnabled: function(brickType, enabled) {
    const multimerLabelId = "#" + brickType + "-multimer-label";
    const multimerCheckboxId = "#" + brickType + "-multimer-checkbox";

    if (enabled) {
      $(multimerLabelId).removeClass("checkbox-label-disabled").addClass("checkbox-label-enabled");
      $(multimerCheckboxId).prop("disabled", false);
    }
    else {
      $(multimerLabelId).removeClass("checkbox-label-enabled").addClass("checkbox-label-disabled");
      $(multimerCheckboxId).prop("disabled", true);
    }
  },
  isMultimerEnabledType: function(type) {
    const multimerEnabledTypes = ["macromolecule", "complex", "simple chemical", "nucleic acid feature"];
    return multimerEnabledTypes.indexOf(type) > -1;
  },
  setResidueFieldEnabled: function(residueFieldElement, enabled) {
    residueFieldElement.prop("disabled", !enabled);
  },
  setInputElementStatus: function(elementId, status) {
    const disabledClass = "text-input-disabled";
    const enabledClass = "text-input-enabled";

    $(elementId).attr('disabled', !status);

    if (status) {
      $(elementId).removeClass(disabledClass).addClass(enabledClass);
    }
    else {
      $(elementId).removeClass(enabledClass).addClass(disabledClass);
    }
  },
  setEventsToSyncInputValues(firstFieldId, secondFieldId) {
    $(document).on("input", firstFieldId, function() {
      const value = $(this).val();
      $(secondFieldId).val(value);
    });

    $(document).on("input", secondFieldId, function() {
      const value = $(this).val();
      $(firstFieldId).val(value);
    });
  },
  initialize: function() {

    var self = this;
    self.template = _.template($("#reaction-template-template").html());
    self.bricksWithOptionalRegulator = ["metabolic-reaction", "conversion", "multimerization", 
                        "association", "dissociation"];

    self.setEventsToSyncInputValues("#conversion-input-name", "#conversion-output-name");
    self.setEventsToSyncInputValues("#multimerization-input-name", "#multimerization-output-name");
    self.setEventsToSyncInputValues("#transcription-regulator-name", "#transcription-output-name");

    self.bricksWithOptionalRegulator.forEach(type => {
      const regulatorCheckboxId = "#" + type + "-regulator-checkbox";
      const regulatorNameInputId = "#" + type + "-regulator-name";
      const regulatorTypeInputId = "#" + type + "-regulator-type";
      const multimerCheckboxId = "#" + type + "-multimer-checkbox";
      const inputTableId = "#" + type + "-input-table";
      const outputTableId = "#" + type + "-output-table";
      const multimerCardinalityFieldId = "#" + type + "-multimer-cardinality";

      $(document).on("input", multimerCardinalityFieldId, function() {
        self.updatePreview();
      });

      $(document).on("click", regulatorCheckboxId, function(event) {
        const checked = event.target.checked;

        $(regulatorTypeInputId).attr('disabled', !checked);

        hasRegulatorEdgeTypeSelector = type === "multimerization" || 
                                        type === "association" || 
                                        type === "dissociation";
        if (hasRegulatorEdgeTypeSelector) {
          const regulatorEdgeTypeSelectorId = "#" + type + "-regulator-edge-type";
          $(regulatorEdgeTypeSelectorId).attr('disabled', !checked);
        }

        self.setInputElementStatus(regulatorNameInputId, checked);
  
        // determine if multimer should be enabled
        const selectedRegulatorType = $(regulatorTypeInputId).val();
        const multimerEnabled = checked && self.isMultimerEnabledType(selectedRegulatorType); 
  
        self.setMultimerCheckboxEnabled(type, multimerEnabled);
        
        self.updatePreview();
      });

      $(document).on("click", multimerCheckboxId, function(event) {
        const checked = event.target.checked;
        self.setInputElementStatus(multimerCardinalityFieldId, checked);
        self.updatePreview();
      });

      $(document).on("input", regulatorNameInputId, function() {
        self.updatePreview();
      });

      $(document).on("change", regulatorTypeInputId, function() {
        // determine if multimer should be enabled
        const selectedRegulatorType = $(regulatorTypeInputId).val();
        const multimerEnabled = self.isMultimerEnabledType(selectedRegulatorType); 
        self.setMultimerCheckboxEnabled(type, multimerEnabled);

        $(multimerCheckboxId).prop('checked', false);
        self.setInputElementStatus(multimerCardinalityFieldId, false)
        
        self.updatePreview();
      });


      const inputFieldSelector = ":input.template-reaction-textbox";
      const inputSelector = inputTableId + " " + inputFieldSelector;
      $(document).on("input", inputSelector, function() {
        self.updatePreview();
      });
      
      const outputSelector = outputTableId + " " + inputFieldSelector;
      $(document).on("input", outputSelector, function() {
        self.updatePreview();
      });

    });

    $(document).on("click", "#conversion-residue-checkbox", function(event) {
      const checked = event.target.checked;
      const residueInputElement = $("#conversion-residue-name");
      const enabledClass = 'text-input-enabled';
      const disabledClass = 'text-input-disabled';
      residueInputElement.attr('disabled', !checked);
      if (checked) {
        residueInputElement.removeClass(disabledClass).addClass(enabledClass);
      }
      else {
        residueInputElement.removeClass(enabledClass).addClass(disabledClass);
      }

      self.updatePreview();
    });

    $(document).on("input", "#degradation-input-name", function() {
      self.updatePreview();
    });

    $(document).on("input", "#transcription-regulator-name", function() {
      self.updatePreview();
    });

    $(document).on("input", "#transcription-output-name", function() {
      self.updatePreview();
    });

    $(document).on("input", "#translation-regulator-name", function() {
      self.updatePreview();
    });

    $(document).on("input", "#translation-output-name", function() {
      self.updatePreview();
    });

    $(document).on("change", "#conversion-reaction-selector", function() {
      const conversionType = $(this).val();

      if (conversionType === "activation" || conversionType === "deactivation") {
        self.setResidueFieldEnabled(false);
      }
      else {
        self.setResidueFieldEnabled(true);
      }

      self.updatePreview();
    })

    $(document).on("input", "#reaction-top-input-row :input.conversion-modification-residue-name", function () {
      self.updatePreview();
    })

    $(document).on("click", "#conversion-macromolecule-multimer-checkbox", function(event) {
      const checked = event.target.checked;
      self.setInputElementStatus("#conversion-macromolecule-multimer-cardinality", checked);
      self.updatePreview();
    })

    $(document).on("input", "#conversion-macromolecule-multimer-cardinality", function() {
      self.updatePreview();
    });

    $(document).on("click", "#metabolic-reaction-reversible-checkbox", function() {
      self.updatePreview();
    });

    $(document).on('change', "#metabolic-reaction-orientation-select", function() {
      self.updatePreview();
    });

    $(document).on('change', '#brick-type-select', function () {
      const selectedBrick = $(this).val();
      self.changeTemplateHTMLContent(selectedBrick);
      self.updatePreview();
    });

    $(document).on("click", "#metabolic-reaction-add-input", function () {
      self.addInputFieldForMetabolicReaction();
      const inputDeleteButtons = $("#metabolic-reaction-input-table img.template-reaction-delete-button"); 
      self.enableImageButtons(inputDeleteButtons);

      self.updatePreview();
    });

    $(document).on("click", "#conversion-add-modification-button", function() {
      self.addModificationForConversion();
      const inputDeleteButtons = $("#reaction-top-input-row img.template-reaction-delete-button"); 
      self.enableImageButtons(inputDeleteButtons);

      self.updatePreview();
    });

    $(document).on("click", "#association-add-input-button", function () {
      self.addAssociationInput();
      const inputDeleteButtons = $("#association-input-table img.template-reaction-delete-button"); 
      self.enableImageButtons(inputDeleteButtons);

      self.updatePreview();
    });

    $(document).on("click", "#dissociation-add-output-button", function () {
      self.addDissociationOutput();
      const inputDeleteButtons = $("#dissociation-output-table img.template-reaction-delete-button"); 
      self.enableImageButtons(inputDeleteButtons);

      self.updatePreview();
    });

    $(document).on("change", "#reaction-top-input-row select.conversion-type-dropdown", function() {
      const conversionType = $(this).val();
      const residueFieldElement = $(this).next().next();
      if (conversionType === "activation" || conversionType === "deactivation") {
        self.setResidueFieldEnabled(residueFieldElement, false);
      }
      else {
        self.setResidueFieldEnabled(residueFieldElement, true);
      }

      self.updatePreview();
    })

    $(document).on("click", "#metabolic-reaction-add-output", function() {
      self.addOutputFieldForMetabolicReaction();
      const outputDeleteButtons = $("#metabolic-reaction-output-table img.template-reaction-delete-button");
      self.enableImageButtons(outputDeleteButtons);

      self.updatePreview();
    });

    $(document).on("click", "#metabolic-reaction-input-table .template-reaction-delete-button", function (event) {
      if($('#metabolic-reaction-input-table tr').length <= 2){
        return;
      }
      const target = event.target;
      $(target).closest('tr').remove();
      if($('#metabolic-reaction-input-table tr').length <= 2){
        const inputDeleteButtons = $("#metabolic-reaction-input-table img.template-reaction-delete-button"); 
        self.disableImageButtons(inputDeleteButtons);
      }

      self.updatePreview();
    });

    $(document).on("click", "#sbgn-brick-middle-row .template-reaction-delete-button", function (event) {
      if($('#sbgn-brick-middle-row tr').length <= 4){
        return;
      }
      const target = event.target;
      $(target).closest('tr').remove();
      if($('#sbgn-brick-middle-row tr').length <= 4){
        const inputDeleteButtons = $("#sbgn-brick-middle-row img.template-reaction-delete-button"); 
        self.disableImageButtons(inputDeleteButtons);
      }

      self.updatePreview();
    });

    $(document).on("click", "#reaction-top-input-row img.template-reaction-delete-button", function(event) {
      if ($('#reaction-top-input-row tr').length <= 2) {
        return;
      }
      const target = event.target;
      $(target).closest('tr').remove();
      if($('#reaction-top-input-row tr').length <= 2){
        const inputDeleteButtons = $("#reaction-top-input-row img.template-reaction-delete-button"); 
        self.disableImageButtons(inputDeleteButtons);
      }

      self.updatePreview();
    });
    

    $(document).on("click", "#metabolic-reaction-output-table .template-reaction-delete-button", function (event) {
      if($('#metabolic-reaction-output-table tr').length <= 2){
        return;
      }
      const target = event.target;
      $(target).closest('tr').remove();
      if($('#metabolic-reaction-output-table tr').length <= 2){
        const outputDeleteButtons = $("#metabolic-reaction-output-table img.template-reaction-delete-button");
        self.disableImageButtons(outputDeleteButtons);
      }

      self.updatePreview();
    });

    ["multimerization", "association", "dissociation"].forEach(function(brick) {
      const id = "#" + brick + "-regulator-edge-type";
      $(document).on("change", id, function() {
        self.updatePreview();
      });
    });

    $(document).on("input", "#multimerization-macromolecule-multimer-cardinality", function() {
      self.updatePreview();
    });

    $(document).on("click", "#create-sbgn-brick", function (evt) {

      // use active chise instance
      var chiseInstance = appUtilities.getActiveChiseInstance();

      // use the assocated cy instance
      var cy = chiseInstance.getCy();

      // get current layout properties for cy
      var currentLayoutProperties = appUtilities.getScratch(cy, 'currentLayoutProperties');

      var templateType = $('#brick-type-select').val();

      if (templateType === "metabolic-reaction") {
        const params = self.getMetabolicReactionParameters();
        chiseInstance.createMetabolicReaction(params.inputData, params.outputData, params.reversible, params.regulator, params.regulatorMultimer, params.orientation);
      }
      else if (templateType === "conversion") {
        const params = self.getConversionParameters();
        chiseInstance.createConversion(params.macromolecule, params.regulator, params.regulatorMultimer, params.orientation, params.inputInfoboxLabels, params.outputInfoboxLabels);
      }
      else if (templateType === "multimerization") {
        const params = self.getMultimerizationParameters();
        chiseInstance.createMultimerization(params.macromolecule, params.regulator, params.regulatorMultimer, params.orientation);
      }
      else if (templateType === "association") {
        const params = self.getAssociationParameters();
        chiseInstance.createComplexProteinFormation(params.inputLabels, params.complexLabel, params.regulator, params.orientation, params.reverse);
      }
      else if (templateType === "dissociation") {
        const params = self.getDissociationParameters();
        chiseInstance.createComplexProteinFormation(params.inputLabels, params.complexLabel, params.regulator, params.orientation, params.reverse);
      }
      else if (templateType === "degradation") {
        const params = self.getDegradationParameters();
        chiseInstance.createDegradation(params.macromolecule, params.orientation);
      }
      else if (templateType === "transcription") {
        const params = self.getTranscriptionParameters();
        chiseInstance.createTranscription(params.label, params.orientation);
      }
      else if (templateType === "translation") {
        const params = self.getTranslationParameters();
        chiseInstance.createTranslation(params.regulatorLabel, params.outputLabel, params.orientation);
      }
      else { 
        console.error("SBGN Bricks - ReactionTemplateView - Create: Reaction type doesn't exist.")
      }
      
      //Update arrow-scale of newly added edges (newly added elements are selected so we just update selected edges)
      var currentArrowScale = Number($('#arrow-scale').val());
      cy.edges(":selected").style('arrow-scale', currentArrowScale);

      $(self.el).modal('toggle');
    });

    $(document).on("click", "#cancel-sbgn-brick", function (evt) {
      $(self.el).modal('toggle');
    });
  },
  render: function() {
    var self = this;
    self.template = _.template($("#reaction-template-template").html());
    $(self.el).html(self.template);
    const inputDeleteButtons = $("#metabolic-reaction-input-table img.template-reaction-delete-button"); 
    self.disableImageButtons(inputDeleteButtons);

    const outputDeleteButtons = $("#metabolic-reaction-output-table img.template-reaction-delete-button"); 
    self.disableImageButtons(outputDeleteButtons);

    $(self.el).modal('show');

    self.chiseInstance = chise({
      networkContainerSelector: "#sbgn-brick-preview-cy-div",
      undoable: false
    });

    self.cy = self.chiseInstance.getCy();
    self.cy.autounselectify(true);
    self.cy.autoungrabify(true);
    self.cy.userPanningEnabled(false);
    self.cy.userZoomingEnabled(false);
    
    setTimeout(function () {
      self.cy.resize();
      self.updatePreview();
    }, 500);

    self.brickMetadata = {
      "metabolic-reaction": {
        "input-side-html": $('#reaction-template-left-td').html(),
        "output-side-html": $("#reaction-template-right-td").html(),
        "top-input-row": $("#reaction-top-input-row").html(),
        "help-link": ["http://sbgnbricks.org/BKO/full/entry/all/BKO:0000585/"]
      },
      "conversion": {
        "input-side-html": $('#conversion-template-left-td').html(),
        "output-side-html": $("#conversion-template-right-td").html(),
        "top-input-row": $("#conversion-top-input-row").html(),
        "help-link": ["http://sbgnbricks.org/BKO/full/entry/all/BKO:0000570/"]
      },
      "multimerization": {
        "input-side-html": $('#multimerization-template-left-td').html(),
        "output-side-html": $("#multimerization-template-right-td").html(),
        "top-input-row": $("#multimerization-top-input-row").html(),
        "help-link": ["http://sbgnbricks.org/BKO/full/entry/all/BKO:0000221/"]
      },
      "association": {
        "input-side-html": $('#association-template-left-td').html(),
        "output-side-html": $("#association-template-right-td").html(),
        "top-input-row": $("#association-top-input-row").html(),
        "help-link": ["http://sbgnbricks.org/BKO/full/entry/all/SBO:0000526/"]
      },
      "dissociation": {
        "input-side-html": $('#dissociation-template-left-td').html(),
        "output-side-html": $("#dissociation-template-right-td").html(),
        "top-input-row": $("#dissociation-top-input-row").html(),
        "help-link": ["http://sbgnbricks.org/BKO/full/entry/all/BKO:0000166/"]
      },
      "degradation": {
        "input-side-html": $('#degradation-template-left-td').html(),
        "output-side-html": $("#degradation-template-right-td").html(),
        "top-input-row": $("#degradation-top-input-row").html(),
        "help-link": ["http://sbgnbricks.org/BKO/full/entry/all/SBO:0000179/"]
      },
      "transcription": {
        "input-side-html": $('#transcription-template-left-td').html(),
        "output-side-html": $("#transcription-template-right-td").html(),
        "top-input-row": $("#transcription-top-input-row").html(),
        "help-link": ["http://sbgnbricks.org/BKO/full/entry/all/SBO:0000183/"]
      },
      "translation": {
        "input-side-html": $('#translation-template-left-td').html(),
        "output-side-html": $("#translation-template-right-td").html(),
        "top-input-row": $("#translation-top-input-row").html(),
        "help-link": ["http://sbgnbricks.org/BKO/full/entry/all/BKO:0000481/"]
      }
    }
    return this;
  }
});

var GridPropertiesView = Backbone.View.extend({
  initialize: function () {
  },
  copyProperties: function () {
    // use active cy instance
    var cy = appUtilities.getActiveCy();

    // clone default props
    var clonedProps = _.clone(appUtilities.defaultGridProperties);

    // update the scratch pad of cy
    appUtilities.setScratch(cy, 'currentGridProperties', clonedProps);

    // return cloned props to make them accessible
    return clonedProps;
  },
  render: function () {

    // use active cy instance
    var cy = appUtilities.getActiveCy();

    // get current grid properties
    var currentGridProperties = appUtilities.getScratch(cy, 'currentGridProperties');

    var self = this;
    self.template = _.template($("#grid-properties-template").html());
    self.template = self.template(currentGridProperties);
    $(self.el).html(self.template);
    bindColorPicker2GridColorInputs();
    $(self.el).modal('show');

    // The following functions give Snap Policy row a radio button functionality
    // and enable Show Grid when Snap to Grid is enabled
    $(document).off("change", "#snap-to-grid").on("change", "#snap-to-grid", function(event){
      $("#show-grid").prop('checked', true);
      $("#snap-to-alignment-location").val("disabled");

      if ($("#snap-to-grid").val() == "disabled" && $("#snap-to-alignment-location").val() == "disabled")
        $("#no-snap").prop('checked', true);
      else
        $("#no-snap").prop('checked', false);
    });

    $(document).off("change", "#snap-to-alignment-location").on("change", "#snap-to-alignment-location", function(event){
      $("#snap-to-grid").val("disabled");
      if ($("#snap-to-grid").val() == "disabled" && $("#snap-to-alignment-location").val() == "disabled")
        $("#no-snap").prop('checked', true);
      else
        $("#no-snap").prop('checked', false);
    });

    $(document).off("click", "#no-snap").on("click", "#no-snap", function(event){
      $("#snap-to-grid").val("disabled");
      $("#snap-to-alignment-location").val("disabled");
    });

    $(document).off("click", "#save-grid").on("click", "#save-grid", function (evt) {

      // use active cy instance
      var cy = appUtilities.getActiveCy();

      // get current grid properties
      var currentGridProperties = appUtilities.getScratch(cy, 'currentGridProperties');

      currentGridProperties.showGrid = document.getElementById("show-grid").checked;
      currentGridProperties.snapToGridOnRelease = $("#snap-to-grid").val() == "onRelease";
      currentGridProperties.snapToGridDuringDrag = $("#snap-to-grid").val() == "duringDrag";
      currentGridProperties.snapToAlignmentLocationOnRelease = $("#snap-to-alignment-location").val() == "onRelease";
      currentGridProperties.snapToAlignmentLocationDuringDrag = $("#snap-to-alignment-location").val() == "duringDrag";
      currentGridProperties.gridSize = Number(document.getElementById("grid-size").value);
      currentGridProperties.gridColor = document.getElementById("grid-color").value;
      currentGridProperties.autoResizeNodes = document.getElementById("auto-resize-nodes").checked;
      currentGridProperties.showGeometricGuidelines = document.getElementById("show-geometric-guidelines").checked;
      currentGridProperties.showDistributionGuidelines = document.getElementById("show-distribution-guidelines").checked;
      currentGridProperties.showInitPosAlignment = document.getElementById("show-init-Pos-Alignment").checked;
      currentGridProperties.guidelineTolerance = Number(document.getElementById("guideline-tolerance").value);
      currentGridProperties.guidelineColor = document.getElementById("geometric-guideline-color").value;
      currentGridProperties.horizontalGuidelineColor = document.getElementById("horizontal-guideline-color").value;
      currentGridProperties.verticalGuidelineColor = document.getElementById("vertical-guideline-color").value;
      currentGridProperties.initPosAlignmentColor = document.getElementById("init-Pos-Alignment-Color").value;
      currentGridProperties.geometricAlignmentRange = Number(document.getElementById("geometric-alignment-range").value);
      currentGridProperties.distributionAlignmentRange = Number(document.getElementById("distribution-alignment-range").value);

	  // Line styles for guidelines
      currentGridProperties.initPosAlignmentLine = $('select[name="init-Pos-Alignment-Line"] option:selected').val().split(',').map(Number);
      currentGridProperties.lineDash = $('select[id="geometric-Alignment-Line"] option:selected').val().split(',').map(Number),
      currentGridProperties.horizontalDistLine = $('select[name="horizontal-Dist-Alignment-Line"] option:selected').val().split(',').map(Number);
      currentGridProperties.verticalDistLine = $('select[name="vertical-Dist-Alignment-Line"] option:selected').val().split(',').map(Number);
      cy.gridGuide({
        drawGrid: currentGridProperties.showGrid,
        gridColor: currentGridProperties.gridColor,
        snapToGridOnRelease: currentGridProperties.snapToGridOnRelease,
        snapToGridDuringDrag: currentGridProperties.snapToGridDuringDrag,
        snapToAlignmentLocationOnRelease: currentGridProperties.snapToAlignmentLocationOnRelease,
        snapToAlignmentLocationDuringDrag: currentGridProperties.snapToAlignmentLocationDuringDrag,
        gridSpacing: currentGridProperties.gridSize,
        resize: currentGridProperties.autoResizeNodes,
        geometricGuideline: currentGridProperties.showGeometricGuidelines,
        distributionGuidelines: currentGridProperties.showDistributionGuidelines,
        initPosAlignment: currentGridProperties.showInitPosAlignment,
        guidelinesTolerance: currentGridProperties.guidelineTolerance,
        guidelinesStyle: {
		  initPosAlignmentLine: currentGridProperties.initPosAlignmentLine,
		  lineDash: currentGridProperties.lineDash,
		  horizontalDistLine: currentGridProperties.horizontalDistLine,
		  verticalDistLine: currentGridProperties.verticalDistLine,
          strokeStyle: currentGridProperties.guidelineColor,
		  horizontalDistColor: currentGridProperties.horizontalGuidelineColor,
		  verticalDistColor: currentGridProperties.verticalGuidelineColor,
		  initPosAlignmentColor: currentGridProperties.initPosAlignmentColor,
          geometricGuidelineRange: currentGridProperties.geometricAlignmentRange,
          range: currentGridProperties.distributionAlignmentRange
        }
      });

      // reset current grid properties in scracth pad of cy
      appUtilities.setScratch(cy, 'currentGridProperties', currentGridProperties);

      $(self.el).modal('toggle');
      $(document).trigger('saveGridProperties', cy);
    });

    $(document).off("click", "#default-grid").on("click", "#default-grid", function (evt) {
      var currentGridProperties = self.copyProperties();
      self.template = _.template($("#grid-properties-template").html());
      self.template = self.template(currentGridProperties);
      $(self.el).html(self.template);
      bindColorPicker2GridColorInputs();
    });

    return this;
  }
});

// If the value includes ' ' char/s replace them with '_' char
// to use it as part of html selector
function sanitizeForHtml( val ) {
  return val.replaceAll( ' ', '_' );
}

function getFontFamilyOptions() {
  return [
    { value: '', label: '' },
    { value: 'Helvetica', label: 'Helvetica' },
    { value: 'Arial', label: 'Arial' },
    { value: 'Calibri', label: 'Calibri' },
    { value: 'Cambria', label: 'Cambria' },
    { value: 'Comic Sans MS', label: 'Comic Sans MS' },
    { value: 'Consolas', label: 'Consolas' },
    { value: 'Corsiva', label: 'Corsiva' },
    { value: 'Courier New', label: 'Courier New' },
    { value: 'Droid Sans', label: 'Droid Sans' },
    { value: 'Droid Serif', label: 'Droid Serif' },
    { value: 'Georgia', label: 'Georgia' },
    { value: 'Impact', label: 'Impact' },
    { value: 'Lato', label: 'Lato' },
    { value: 'Roboto', label: 'Roboto' },
    { value: 'Source Sans Pro', label: 'Source Sans Pro' },
    { value: 'Syncopate', label: 'Syncopate' },
    { value: 'Times New Roman', label: 'Times New Roman' },
    { value: 'Trebuchet MS', label: 'Trebuchet MS' },
    { value: 'Ubuntu', label: 'Ubuntu' },
    { value: 'Verdana', label: 'Verdana' }
  ];
}

function getFontWeightOptions() {
  return [
    { value: '', label: '' },
    { value: 'lighter', label: 'Lighter' },
    { value: 'normal', label: 'Normal' },
    { value: 'bold', label: 'Bold' },
    { value: 'bolder', label: 'Bolder' }
  ];
}

function getFontStyleOptions() {
  return [
    { value: '', label: '' },
    { value: 'normal', label: 'Normal' },
    { value: 'italic', label: 'Italic' },
    { value: 'oblique', label: 'Oblique' }
  ];
}

function generateFontPropertiesRows(selectorPrefix, labelPrefix, properties) {
  var html = "";

  var familyOptStyle = [{
    name: 'font-family',
    value: function(ff) {
      return ff;
    }
  }];

  html += wrapToTr( [ generateLabelTd( 'Family', labelPrefix ),
          generateSelectListTd( getFontFamilyOptions(), properties.fontFamily, selectorPrefix, 'font-family', familyOptStyle ) ] );

  html += wrapToTr( [ generateLabelTd( 'Size', labelPrefix ),
          generateIntegerInputBoxTd( selectorPrefix, 'font-size', properties.fontSize ) ] );

  html += wrapToTr( [ generateLabelTd( 'Weight', labelPrefix  ),
          generateSelectListTd( getFontWeightOptions(), properties.fontWeight, selectorPrefix, 'font-weight' ) ] );

  html += wrapToTr( [ generateLabelTd( 'Type', labelPrefix ),
          generateSelectListTd( getFontStyleOptions(), properties.fontStyle, selectorPrefix, 'font-style' ) ] );

  html += wrapToTr( [ generateLabelTd( 'Color', labelPrefix ),
          generateColorInputBoxTd( selectorPrefix, 'font-color', properties.fontColor ) ] );

  return html;
}

function generateColorInputBoxTd(selectorPrefix, propName, value) {
  var id = generateInputId( propName, selectorPrefix );
  var html = '<input id="' + id + '"'
          + ' class="inspector-input-box"'
          + ' type="color"'
          + ' name="' + id + '"'
          + ' value="' + value +  '"'
          + '/>';

  return wrapToTd( html );
}

function generateIntegerInputBoxTd(selectorPrefix, propName, value) {
  var html = '<input id="' + generateInputId( propName, selectorPrefix ) + '"'
          + ' type="text"'
          + ' min="1"'
          + ' class="sbgn-input-small layout-text integer-input"'
          + ' value="' + value + '"'
          + '/>';

  return wrapToTd( html );
}

function generateInputId( propName, selectorPrefix, selectorPostfix ) {
  var pretext = selectorPrefix ? selectorPrefix + '-' : '';
  var posttext = selectorPostfix ? '-' + selectorPostfix : '';
  return pretext + propName + posttext;
}

function generateSelectBoxNameSelector( propName, selectorPrefix ) {
  var id = generateInputId( propName, selectorPrefix, 'select-box' );
  var selector = 'select[name="' + id + '"] option:selected';

  return selector;
}

function generateSelectListTd(options, selectedVal, selectorPrefix, propName, optionStyle) {
  var html = '';
  var selectboxId = generateInputId( propName, selectorPrefix, 'select-box' );
  var selectBoxOpenHtml = '<select id="' + selectboxId + '"'
    + ' class="input-medium layout-text"'
    + ' name="' + selectboxId + '"'
    + '>';

  html += selectBoxOpenHtml;

  var getSelectedStr = function( optionVal ) {
    return optionVal === selectedVal ? ' selected' : '';
  };

  options.forEach( function( option ) {
    var optionVal = option.value;
    var postfix = optionVal ? optionVal : 'none';
    postfix = sanitizeForHtml( postfix );
    var optionLabel = option.label;

    var styleStr = '';

    if ( optionStyle && optionStyle.length > 0 ) {
      var styleStr = ' style="';
      optionStyle.forEach( function( style ) {
        var val = typeof style.value == 'function' ?
                  style.value( optionVal ) : optionVal;
        styleStr += ( style.name + ': ' + val + ';' );
      } );
      styleStr += '"';
    }

    var optionId = generateInputId( propName, selectorPrefix, postfix );
    var optionHtml = '<option id="' + optionId + '"'
      + ' value="' + optionVal + '"'
      + styleStr
      + getSelectedStr( optionVal )
      + '>'
      + option.label
      + '</option>';

    html += optionHtml;
  } );

  html += '</select>';

  return wrapToTd( html );
}

function generateLabelTd(mainText, prefix, postfix) {
  prefix = prefix ? prefix + ' ' : '';
  postfix = postfix ? ' ' + postfix : '';
  label = prefix + mainText + postfix;

  return wrapToTd( '<span class="add-on layout-text">' + label + '</span>' );
}

function wrapToTd(innerHtml){
  var html = '<td>';
  html += innerHtml;
  html += '</td>';

  return html;
}

function wrapToTr(tdList) {
  var html = '<tr>';

  tdList.forEach( function( td ) {
    html += td;
  } );

  html += '</tr>';

  return html;
}

var FontPropertiesView = Backbone.View.extend({
  defaultFontProperties: {
    fontFamily: "",
    fontSize: "",
    fontWeight: "",
    fontStyle: "",
    fontColor: ""
  },
  currentFontProperties: undefined,
  selectorPrefix: 'font-properties',
  copyProperties: function () {
    this.currentFontProperties = _.clone(this.defaultFontProperties);
  },
  initialize: function () {
    var self = this;
    self.copyProperties();
    self.defaultFontProperties.generateFontPropertiesRows = function() {
      return generateFontPropertiesRows( self.selectorPrefix, '', self.currentFontProperties );
    };
    self.template = _.template($("#font-properties-template").html());
    self.template = self.template(self.defaultFontProperties);
  },
  extendProperties: function (eles) {

    var chiseInstance = appUtilities.getActiveChiseInstance();

    var self = this;
    var commonProperties = {};

    // Get common properties. Note that we check the data field for labelsize property and css field for other properties.
    var commonFontSize = parseInt(chiseInstance.elementUtilities.getCommonProperty(eles, "font-size", "data"));
    var commonFontWeight = chiseInstance.elementUtilities.getCommonProperty(eles, "font-weight", "data");
    var commonFontFamily = chiseInstance.elementUtilities.getCommonProperty(eles, "font-family", "data");
    var commonFontStyle = chiseInstance.elementUtilities.getCommonProperty(eles, "font-style", "data");
    var commonFontColor = chiseInstance.elementUtilities.getCommonProperty(eles, "color", "data");

    if( commonFontSize != null ) {
      commonProperties.fontSize = commonFontSize;
    }

    if( commonFontWeight != null ) {
      commonProperties.fontWeight = commonFontWeight;
    }

    if( commonFontFamily != null ) {
      commonProperties.fontFamily = commonFontFamily;
    }

    if( commonFontStyle != null ) {
      commonProperties.fontStyle = commonFontStyle;
    }

    if (commonFontColor != null) {
      commonProperties.fontColor = commonFontColor;
    }

    self.currentFontProperties = $.extend({}, this.defaultFontProperties, commonProperties);
  },
  render: function (eles) {
    var self = this;
    self.extendProperties(eles);
    self.template = _.template($("#font-properties-template").html());
    self.template = self.template(self.currentFontProperties);
    $(self.el).html(self.template);
    colorPickerUtils.bindPicker2Input('#' + generateInputId('font-color', self.selectorPrefix), null);
    $(self.el).modal('show');

    $(document).off("click", "#set-font-properties").on("click", "#set-font-properties", function (evt) {

      // use the active chise instance
      var chiseInstance = appUtilities.getActiveChiseInstance();

      // use the associated cy instance
      var cy = chiseInstance.getCy();

      var data = {};

      var fontsize = $( '#' + generateInputId( 'font-size', self.selectorPrefix ) ).val();
      var fontfamily = $( generateSelectBoxNameSelector( 'font-family', self.selectorPrefix ) ).val();
      var fontweight = $( generateSelectBoxNameSelector( 'font-weight', self.selectorPrefix ) ).val();
      var fontstyle = $( generateSelectBoxNameSelector( 'font-style', self.selectorPrefix ) ).val();
      var fontcolor = $( '#' + generateInputId( 'font-color', self.selectorPrefix ) ).val();

      if ( fontsize != '' ) {
        data['font-size'] = parseInt(fontsize);
      }

      if ( fontfamily != '' ) {
        data['font-family'] = fontfamily;
      }

      if ( fontweight != '' ) {
        data['font-weight'] = fontweight;
      }

      if ( fontstyle != '' ) {
        data['font-style'] = fontstyle;
      }

      if ( fontcolor != '') {
        data['color'] = fontcolor;
      }

      var keys = Object.keys(data);

      if(keys.length === 0) {
        return;
      }

      var validAction = false; // If there is nothing to change the action is not valid

      for ( var i = 0; i < eles.length; i++ ) {
        var ele = eles[i];

        keys.forEach(function(key, idx) {
          // If there is some property to change signal that the action is valid.
          if (data[key] != ele.data(key)){
            validAction = true;
          }
        });

        if ( validAction ) {
          break;
        }
      }

      if ( validAction === false ) {
        $(self.el).modal('toggle');
        return;
      }

      chiseInstance.changeFontProperties(eles, data);

      self.copyProperties();


      $(self.el).modal('toggle');
	    $(document).trigger('saveFontProperties', cy);
    });

    return this;
  }
});

var InfoboxPropertiesView = Backbone.View.extend({
  currentProperties: null,
  initialize: function () {
  },
  propsMap: {
    'fontFamily': 'font-family',
    'fontSize': 'font-size',
    'fontWeight': 'font-weight',
    'fontStyle': 'font-style',
    'fontColor': 'font-color',
    'borderColor': 'border-color',
    'fillColor': 'background-color',
    'borderWidth': 'border-width',
    'shapeName': 'shape-name'
  },
  selectorPrefix: 'infobox-properties',
  fontLabelPrefix: 'Font ',
  updateCurrentProperties: function(infobox) {
    var self = this;
    var infoboxStyle = infobox.style;

    self.currentProperties = {};

    for ( var prop in this.propsMap ) {
      var mappedProp = this.propsMap[ prop ];
      self.currentProperties[ prop ] = infoboxStyle[ mappedProp ];
    }

    self.currentProperties.generateSelectShapeRow = function() {
      var chiseInstance = appUtilities.getActiveChiseInstance();
      var cy = appUtilities.getActiveCy();
      var elementUtilities = chiseInstance.elementUtilities;
      var parent = chiseInstance.classes.getAuxUnitClass(infobox).getParent(infobox, cy);
      var shapeListFcn;

      switch (infobox.clazz) {
        case 'state variable':
          shapeListFcn = elementUtilities.getStateVarShapeOptions;
          break;
        case 'unit of information':
          shapeListFcn = elementUtilities.getUnitOfInfoShapeOptions;
          break;
      }

      shapeList = shapeListFcn( parent.data( 'class' ) );

      if ( shapeList.length <= 1 ) {
        return "";
      }

      var options = [];

      shapeList.forEach( function( shapeName ) {
        options.push( {
          value: shapeName,
          label: shapeName
        } );
      } );

      return wrapToTr( [ generateLabelTd( 'Shape', null ),
              generateSelectListTd( options, self.currentProperties.shapeName, self.selectorPrefix, 'shape-name' ) ] );
    };

    self.currentProperties.generateFontPropertiesRows = function() {
      return generateFontPropertiesRows( self.selectorPrefix, self.fontLabelPrefix, self.currentProperties );
    };

    self.currentProperties.generateSetAsDefaultText = function() {
      var chiseInstance = appUtilities.getActiveChiseInstance();
      var cy = appUtilities.getActiveCy();
      var parent = chiseInstance.classes.getAuxUnitClass(infobox).getParent(infobox, cy);
      var classInfo = appUtilities.transformClassInfo( parent.data('class') );
      var infoboxInfoMap = {
        'state variable': 'State Variable',
        'unit of information': 'Unit of Information'
      };
      var infoboxInfo = infoboxInfoMap[ infobox.clazz ];

      return 'Set as Default for ' + infoboxInfo + ' of ' + classInfo;
    }
  },
  render: function (node, index) {
    var self = this;
    var infoboxObj = node.data('statesandinfos')[index];

    var inputTypes = {
      'font-size': 'regular',
      'font-family': 'selectbox',
      'font-weight': 'selectbox',
      'font-style': 'selectbox',
      'font-color': 'regular',
      'border-color': 'regular',
      'background-color': 'regular',
      'border-width': 'regular',
      'shape-name': 'selectbox'
    };

    self.updateCurrentProperties(infoboxObj);
    self.template = _.template($("#infobox-properties-template").html());
    self.template = self.template(self.currentProperties);
    $(self.el).html(self.template);
    colorPickerUtils.bindPicker2Input('#infobox-properties-border-color', null);
    colorPickerUtils.bindPicker2Input('#infobox-properties-background-color', null);
    colorPickerUtils.bindPicker2Input('#' + generateInputId('font-color', self.selectorPrefix), null);

    $(self.el).modal('show');

    function readInfoboxProps() {
      var props = {};

      for ( prop in self.propsMap ) {
        var mappedProp = self.propsMap[ prop ];
        var val;

        if ( inputTypes[ mappedProp ] == 'regular' ) {
          val = $( '#' + generateInputId( mappedProp, self.selectorPrefix ) ).val();
        }
        else if ( inputTypes[ mappedProp ] == 'selectbox' ) {
          val = $( generateSelectBoxNameSelector( mappedProp, self.selectorPrefix ) ).val();
        }

        props[ mappedProp ] = val;
      }

      return props;
    }

    $(document).off("click", "#set-infobox-properties").on("click", "#set-infobox-properties", function( evt ) {
      var newProps = readInfoboxProps();

      appUtilities.getActiveChiseInstance().updateInfoboxStyle(node, index, newProps);

      $(self.el).modal('toggle');
    });

    $(document).off("click", "#set-as-default-infobox-properties").on("click", "#set-as-default-infobox-properties", function( evt ) {

      if (typeof appUtilities.stagedElementStyles === 'undefined') {
        appUtilities.stagedElementStyles = [];
      } 
     
      var chiseInstance = appUtilities.getActiveChiseInstance();
      var cy = appUtilities.getActiveCy();
      var parent = chiseInstance.classes.getAuxUnitClass(infoboxObj).getParent(infoboxObj, cy);
      var parentClass = parent.data('class');

     
      var updates = readInfoboxProps();
      var currentDefaults = chiseInstance.elementUtilities.getDefaultProperties( parentClass )[ infoboxObj.clazz ];
      var infoboxStyle = $.extend( {}, currentDefaults, updates );
      chiseInstance.setDefaultProperty( parentClass, infoboxObj.clazz, infoboxStyle );

      var  stagedElement =  appUtilities.stagedElementStyles.find(b => b.element == parentClass);
      if(stagedElement)
      {
        var stagedElementInfoboxStyles = stagedElement.infoBoxStyles.find(b=>b.clazz == infoboxObj.clazz);
        if(stagedElementInfoboxStyles)
        {
          stagedElementInfoboxStyles.styles = infoboxStyle;
        }
        else
        {
          stagedElement.infoBoxStyles.push({clazz:infoboxObj.clazz,styles:infoboxStyle});
        }
      }
      else
      {
            appUtilities.stagedElementStyles.push({element : parentClass, type:'node',styles:[], infoBoxStyles:[{clazz:infoboxObj.clazz,styles:infoboxStyle}]});
      }

     
    });
  }
});

var AnnotationListView = Backbone.View.extend({
  elements: [],
  el: '#annotations-container',
  initialize: function () {
    this.listenTo(this.model, 'add', this.addAnnotationElementView);
    this.listenTo(this.model, 'destroy', this.resetAndPopulate);
    this.resetAndPopulate();
  },
  events: {
    'click #annotations-add-button': 'createAnnotation'
  },
  resetAndPopulate: function() {
    this.elements = [];
    this.render();
    // populate from the model
    var self = this;
    this.model.forEach(function(item){
      self.addAnnotationElementView(item);
    });
  },
  createAnnotation: function(e) {
    var newAnnot = this.model.create({cyParent: this.model.cyParent});
  },
  addAnnotationElementView: function(annotationModel) {
    var view = new AnnotationElementView({model: annotationModel});
    this.elements.push(view);
    this.$el.find('p#annotations-small-helptext').remove();
    this.$el.children('div').first().append(view.render().el);
  },
  render: function () {
    this.template = _.template($("#annotation-list-template").html());
    this.$el.empty();
    var renderedElement = [];
    for(var i=0; i<this.elements.length; i++) {
      renderedElement.push(this.elements[i].render().$el.html());
    }
    this.$el.html(this.template({elements: renderedElement}));
    return this;
  }
});

var AnnotationElementView = Backbone.View.extend({
  //status is: unchecked, pending, validated, error
  previousSelectedRelation: null, // convenience variable, to check change in controlled vocabulary mode
  tagName: 'div',
  initialize: function () {
    /**
     * We need to debounce the text input, but if we do that when defining events normally, we lose the context (this)
     * So we need to bind this event manually here, after other events have been defined (this is done before initialize)
     * This is done through delegateEvents
     */
    var eventsHash = this.events; // get all defined events
    eventsHash["input .annotations-object-identifier"] = _.debounce(this.valueChangeHandler, 1000); // add the one that need debounce
    this.delegateEvents(eventsHash); // redefine all events with delegate

    /** bind events triggered on change of model */
    this.listenTo(this.model, 'change:status', this.statusChangeHandler);
  },
  events: {
    "change .annotations-db-list": 'dbChangeHandler',
    "change .annotations-vocabulary-list": 'vocabularyChangeHandler',
    "click .annotations-retry-validation": 'retryHandler',
    "click .delete-annotation": 'deleteHandler'
    //"input .annotations-object-identifier": "valueChangeHandler" <-- see initialize
  },
  dbChangeHandler: function(e) {
    var selectedDBkey = $(e.currentTarget).val();
    if (this.underControlledMode()) {
      this.model.set('selectedDB', selectedDBkey);
      this.model.save();
      this.launchValidation();
    }
    else {
      if (selectedDBkey && !(selectedDBkey.length === 0 || !selectedDBkey.trim())) {
        // real value provided
        var globalProp = this.model.constructor.userDefinedProperties;
        if (!_.contains(globalProp, selectedDBkey)) {
          globalProp.push(selectedDBkey);
        }
        this.model.set('selectedDB', selectedDBkey);
        this.model.save();
        this.render();
      }
    }
  },
  valueChangeHandler: function (e) {
    var identifier = $(e.currentTarget).val();
    this.model.set('annotationValue', identifier);
    this.model.save();
    if (this.underControlledMode()) {
      this.launchValidation();
    }
  },
  vocabularyChangeHandler: function(e) {
    var relation = $(e.currentTarget).val();
    var previouslyControlledMode = this.underControlledMode(this.previousSelectedRelation);
    var nowControlledMode = this.underControlledMode(relation);
    this.model.set('selectedRelation', relation);

    if (previouslyControlledMode && !nowControlledMode) {
      // went from controlled into uncontrolled mode, reset key
      this.model.set('selectedDB', null);
      // validation cannot be applied, considered always valid
      this.model.set('status', 'validated');
    }
    else if (!previouslyControlledMode && nowControlledMode) {
      // went from uncontrolled to controlled, select defaults db
      this.model.set('selectedDB', this.model.defaults.selectedDB);
      // reset validation status
      this.model.set('status', 'unchecked');
    }

    this.model.save();
    this.render();
  },
  retryHandler: function(e) {
    this.launchValidation();
  },
  statusChangeHandler: function(annotationModel) {
    this.render();
  },
  deleteHandler: function(e) {
    this.model.destroy();
    this.remove();
  },
  underControlledMode: function(relation) {
    if (relation) {
      return this.model.constructor.vocabulary[relation].controlled;
    }
    else {
      return this.model.constructor.vocabulary[this.model.get('selectedRelation')].controlled;
    }
  },
  render: function () {
    this.template = _.template($("#annotation-element-template").html());
    this.$el.empty();
    this.$el.html(this.template({
      vocabulary: this.model.constructor.vocabulary,
      dbList: this.model.constructor.dbList,
      userDefinedProperties: this.model.constructor.userDefinedProperties,
      status: this.model.get('status'),
      index: this.model.collection.indexOf(this.model),
      selectedDB: this.model.get('selectedDB'),
      selectedRelation: this.model.get('selectedRelation'),
      annotationValue: this.model.get('annotationValue')
    }));
    this.previousSelectedRelation = this.model.get('selectedRelation'); // save the value of relation, for comparison
    return this;
  },
  launchValidation: function () {
    var index = this.model.collection.indexOf(this.model);
    var selectedDBkey = this.model.get('selectedDB');
    var identifier = this.model.get('annotationValue');
    // we don't need to validate if the input is empty or blank
    if (identifier && !(identifier.length === 0 || !identifier.trim())) {
      this.model.set('status', 'pending');
      var validateAnnotation = this.model.get('validateAnnotation');
      var self = this;
      validateAnnotation(selectedDBkey, identifier, function(err, result) {
        if(err) {
          self.model.set('status', 'error');
          self.model.save();
          console.error("validation error", err);
          return;
        }
        // result contains the validated url
        self.model.set('status', 'validated');
        self.model.set('annotationValue', result);
        self.model.save();
        self.render();
      });
    }
  }
});

function bindColorPicker2GridColorInputs() {
  const ids = ['#grid-color', '#init-Pos-Alignment-Color', '#geometric-guideline-color', '#horizontal-guideline-color', '#vertical-guideline-color'];
  for (let i = 0; i < ids.length; i++) {
    colorPickerUtils.bindPicker2Input(ids[i], null);
  }
}

module.exports = {
//  BioGeneView: BioGeneView,
  ChemicalView: ChemicalView,
  LayoutPropertiesView: LayoutPropertiesView,
  ColorSchemeInspectorView: ColorSchemeInspectorView,
  MapTabGeneralPanel: MapTabGeneralPanel,
  MapTabLabelPanel: MapTabLabelPanel,
  MapTabRearrangementPanel: MapTabRearrangementPanel,
  experimentTabPanel: experimentTabPanel,
  //GeneralPropertiesView: GeneralPropertiesView,
  NeighborhoodQueryView: NeighborhoodQueryView,
  PathsBetweenQueryView: PathsBetweenQueryView,
  PathsFromToQueryView: PathsFromToQueryView,
  CommonStreamQueryView: CommonStreamQueryView,
  PathsByURIQueryView: PathsByURIQueryView,
  PromptSaveView: PromptSaveView,
  FileSaveView: FileSaveView,
  SaveUserPreferencesView:SaveUserPreferencesView,
  LoadUserPreferencesView:LoadUserPreferencesView,
  PromptConfirmationView: PromptConfirmationView,
  PromptMapTypeView: PromptMapTypeView,
  PromptInvalidFileView: PromptInvalidFileView,
  PromptInvalidTypeWarning: PromptInvalidTypeWarning,
  PromtErrorPD2AF: PromtErrorPD2AF,
  PromptFileConversionErrorView: PromptFileConversionErrorView,
  ReactionTemplateView: ReactionTemplateView,
  GridPropertiesView: GridPropertiesView,
  FontPropertiesView: FontPropertiesView,
  InfoboxPropertiesView: InfoboxPropertiesView,
  AnnotationListView: AnnotationListView,
  AnnotationElementView: AnnotationElementView,
  PromptInvalidURIView: PromptInvalidURIView,
  PromptInvalidURIWarning: PromptInvalidURIWarning,
  PromptInvalidURLWarning: PromptInvalidURLWarning,
  PromptInvalidImageWarning: PromptInvalidImageWarning,
  PromptInvalidEdgeWarning: PromptInvalidEdgeWarning,
  PromptSbmlConversionErrorView : PromptSbmlConversionErrorView
};
