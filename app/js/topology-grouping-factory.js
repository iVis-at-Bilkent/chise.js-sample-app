var isEqual = require('lodash.isequal');

module.exports = function() {

  var cy, chiseInstance, elementUtilities;
  // TODO: update it as 'topology group' when fix the related bug or
  // apply a temporary a solution
  var GROUP_COMPOUND_TYPE = 'compartment';

  function topologyGrouping( _chiseInstance ) {
    chiseInstance = _chiseInstance;
    cy = chiseInstance.getCy();
    elementUtilities = chiseInstance.elementUtilities;
  }

  topologyGrouping.apply = function() {
    var list = cy.nodes().map( function( node ) {
      return [ node ];
    } );

    // determine node groups by their topology
  	var groups = getNodeGroups( list );
  	// apply grouping in cy level
  	applyGrouping( groups );

  	return groups;
  };

  topologyGrouping.unapply = function() {
    var metaEdges = cy.edges('[sif-meta]');
    metaEdges.forEach( function( edge ) {
      var toRestore = edge.data('toRestore');
      edge.remove();
      toRestore.restore();
    } );

    var parents = getGroupCompounds();
    elementUtilities.changeParent( parents.children(), null );
    parents.remove();
  };

  function getGroupCompounds() {
    var className = GROUP_COMPOUND_TYPE;
    return cy.nodes('[class="' + className + '"]');
  }

  function getNodeGroups( list ) {
    if ( list.length <= 1 ) {
      return list;
    }

    var halves = getHalves( list );
    var firstPart = getNodeGroups( halves[ 0 ] );
    var secondPart = getNodeGroups( halves[ 1 ] );
    // merge the halves
	  var groups = mergeGroups( firstPart, secondPart );

    return groups;
  }

  function getParentOrSelf( node ) {
    var parent = node.parent();
    return parent.size() > 0 ? parent : node;
  }

  function calcGroupingKey( edge ) {
    var srcId = getParentOrSelf( edge.source() ).id();
    var tgtId = getParentOrSelf( edge.target() ).id();
    var edgeType = getEdgeType( edge );

    return [ edgeType, srcId, tgtId ].join( '-' );
  }

  function addToMapChain( map, key, val ) {
    if ( !map[ key ] ) {
      map[ key ] = cy.collection();
    }

    map[ key ] = map[ key ].add( val );
  }

  function applyGrouping( groups ) {
    groups.forEach( function( group ) {
      createGroupCompound( group );
    } );

    var childrenEdges = getGroupCompounds().children().connectedEdges();
    var edgesMap = [];

    childrenEdges.forEach( function( edge ){
      var key = calcGroupingKey( edge );
      addToMapChain( edgesMap, key, edge );
      edge.remove();
    } );

    Object.keys( edgesMap ).forEach( function( key ) {
      // make a dummy edge for all of edges that are mapped by key
  		// dummy edge should have common properties of given edges
  		// and should carry their id list in its data
  		// for source and target it should have parent of common source and target
      createMetaEdgeFor( edgesMap[ key ] );
    } );
  }

  function createGroupCompound( group ) {
    if ( group.length < 2 ) {
      return;
    }

    var collection = cy.collection();

    group.forEach( function( node ) {
      collection = collection.add( node );
    } );

    elementUtilities.createCompoundForGivenNodes( collection, GROUP_COMPOUND_TYPE );
  }

  function createMetaEdgeFor( edges ) {
    // TODO: give more details to meta edge
    var srcId = getParentOrSelf( edges.source() ).id();
    var tgtId = getParentOrSelf( edges.target() ).id();
    var type = edges.data( 'class' );
    cy.remove( edges );

    var metaEdge = elementUtilities.addEdge( srcId, tgtId, type );
    metaEdge.data( 'toRestore', edges );
    metaEdge.data( 'sif-meta', true );

    return metaEdge;
  }

  function mergeGroups( groups1, groups2 ) {
    // notMergedGrs will include members of groups1 that are not merged
  	// mergedGrs will include the merged members from 2 groups
  	var notMergedGrs = [], mergedGrs = [];

    groups1.forEach( function( gr1 ) {
      var merged = false;

      mergedGrs.concat( groups2 ).forEach( function( gr2, index2 ) {
        // if groups should be merged merge them, remove gr2 from where it
        // comes from and push the merge result to mergedGrs
        if ( shouldMerge( gr1, gr2 ) ) {
          var mergedGr = gr1.concat( gr2 );

          if ( index2 >= mergedGrs.length ) {
            removeAt( groups2, index2 - mergedGrs.length );
          }
          else {
            removeAt( mergedGrs, index2 );
          }

          // mark as merged and break the loop
          mergedGrs.push( mergedGr );
          merged = true;
          return;
        }
      } );

      // if gr1 is not merged push it to notMergedGrs
      if ( !merged ) {
        notMergedGrs.push( gr1 )
      }
    } );

    // the groups that comes from groups2 but not merged are still included
	  // in groups2 add them to the result together with mergedGrs and notMergedGrs
    return notMergedGrs.concat( mergedGrs, groups2 );
  }

  function shouldMerge( group1, group2 ) {
    // using first elements is enough to decide whether to merge
  	var node1 = group1[ 0 ];
  	var node2 = group2[ 0 ];

    if ( node1.edges().length !== node2.edges().length ) {
      return false;
    }

    var getUndirectedEdges = function( node ) {
      var edges = node.connectedEdges().filter( isUndirectedEdge );
      return edges;
    };
    // undirected edges of node1 and node2 respectively
    var undir1 = getUndirectedEdges( node1 );
    var undir2 = getUndirectedEdges( node2 );

    var in1 = node1.incomers().edges().not( undir1 );
    var in2 = node2.incomers().edges().not( undir2 );

    var out1 = node1.outgoers().edges().not( undir1 );
	  var out2 = node2.outgoers().edges().not( undir2 );

    return compareEdgeGroup( in1, in2, node1, node2 )
            && compareEdgeGroup( out1, out2, node1, node2 )
            && compareEdgeGroup( undir1, undir2, node1, node2 );
  }

  // decide if 2 edge groups contains set of edges with similar content (type,
  // source,target) relative to their nodes where gr1 are edges of node1 and gr2 are edges of
  // node2
  function compareEdgeGroup( gr1, gr2, node1, node2 ) {
    var id1 = node1.id();
    var id2 = node2.id();

    var map1 = fillIdToTypeSetMap( gr1, node1 );
    var map2 = fillIdToTypeSetMap( gr2, node2 );

    if ( Object.keys( map1 ).length !== Object.keys( map2 ).length ) {
      return;
    }

    var notPassed = false;

    // TODO: make an early termination in a way
    Object.keys( map1 ).forEach( function( key ) {
      // if key is id2 use id1 instead because comparison is relative to nodes
      var otherKey = ( key == id2 ) ? id1 : key;

      // check if the sets have the same content
  		// if check fails return false
      if ( !isEqual( map1[ key ], map2[ otherKey ] ) ) {
        notPassed = true;
      }
    } );

    // if check passes for each key return true
    return !notPassed;
  }

  function fillIdToTypeSetMap( edgeGroup, node ) {
    var map = {};
    var nodeId = node.id();

    edgeGroup.forEach( function( edge ) {
      var srcId = edge.data('source');
      var tgtId = edge.data('target');
      var edgeId = edge.id();

      var otherEnd = ( nodeId === tgtId ) ? srcId : tgtId;

      function addToRelatedSet( sideStr, value ) {
        if ( !map[ sideStr ] ) {
          map[ sideStr ] = new Set();
        }

        map[ sideStr ].add( value );
      }

      var edgeType = getEdgeType( edge );

      addToRelatedSet( otherEnd, edgeType );
    } );

    return map;
  }

  function getEdgeType( edge ) {
    return edge.data( 'class' );
  }

  function isUndirectedEdge( edge ) {
    return elementUtilities.isUndirectedEdge( edge );
  }

  // get halves of a list. It is assumed that list size is at least 2.
  function getHalves( list ) {
    var s = list.length;
    var halfIndex = Math.floor( s / 2 );
    var firstHalf = list.slice( 0, halfIndex );
    var secondHalf = list.slice( halfIndex, s );

    return [ firstHalf, secondHalf ];
  }

  function removeAt( arr, index ) {
    arr.splice( index, 1 );
  }

  return topologyGrouping;
};
