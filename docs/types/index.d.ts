/*
* @license Apache-2.0
*
* Copyright (c) 2021 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

// TypeScript Version: 4.1

/* eslint-disable max-lines */

import incrBinaryClassification = require( '@stdlib/ml-incr-binary-classification' );
import incrkmeans = require( '@stdlib/ml-incr-kmeans' );
import incrSGDRegression = require( '@stdlib/ml-incr-sgd-regression' );

/**
* Interface describing the `incr` namespace.
*/
interface Namespace {
	/**
	* Returns an accumulator function which incrementally performs binary classification using stochastic gradient descent (SGD).
	*
	* ## Method
	*
	* -   The sub-gradient of the loss function is estimated for each datum and the classification model is updated incrementally, with a decreasing learning rate and regularization of model feature weights using L2 regularization.
	* -   Stochastic gradient descent is sensitive to the scaling of the features. One is advised to either scale each feature to `[0,1]` or `[-1,1]` or to transform each feature into z-scores with zero mean and unit variance. One should keep in mind that the same scaling has to be applied to training data in order to obtain accurate predictions.
	* -   In general, the more data provided to an accumulator, the more reliable the model predictions.
	*
	* ## References
	*
	* -   Shalev-Shwartz, S., Singer, Y., Srebro, N., & Cotter, A. (2011). Pegasos: Primal estimated sub-gradient solver for SVM. Mathematical Programming, 127(1), 3–30. doi:10.1007/s10107-010-0420-4
	*
	* @param N - number of features
	* @param options - options object
	* @param options.lambda - regularization parameter (default: `1.0e-4`)
	* @param options.learningRate - learning rate function and associated parameters (default: `['basic']`)
	* @param options.loss - loss function  (default: `'log'`)
	* @param options.intercept - boolean indicating whether to include an intercept (default: `true`)
	* @throws first argument must be a positive integer
	* @throws must provide valid options
	* @returns accumulator function
	*
	* @example
	* var Float64Array = require( '@stdlib/array-float64' );
	* var array = require( '@stdlib/ndarray-array' );
	*
	* // Create an accumulator:
	* var accumulator = ns.incrBinaryClassification( 3, {
	*     'intercept': true,
	*     'lambda': 1.0e-5
	* });
	*
	* // ...
	*
	* // Update the model:
	* var x = array( new Float64Array( [ 2.3, 1.0, 5.0 ] ) );
	* var coefs = accumulator( x, 1 );
	* // returns <ndarray>
	*
	* // ...
	*
	* // Create a new observation vector:
	* x = array( new Float64Array( [ 2.3, 5.3, 8.6 ] ) );
	*
	* // Predict the response value:
	* var yhat = accumulator.predict( x );
	* // returns <ndarray>
	*/
	incrBinaryClassification: typeof incrBinaryClassification;

	/**
	* Returns an accumulator function which incrementally partitions data into `k` clusters.
	*
	* @param k - number of clusters or a `k x ndims` matrix containing initial centroids
	* @param ndims - number of dimensions (should only be provided if provided a numeric `k` argument)
	* @param options - function options
	* @param options.metric - distance metric (default: 'euclidean')
	* @param options.init - method for determining initial centroids
	* @param options.normalize - boolean indicating whether to normalize incoming data (only relevant for non-Euclidean distance metrics) (default: true)
	* @param options.copy - boolean indicating whether to copy incoming data to prevent mutation during normalization (default: true)
	* @param options.seed - PRNG seed
	* @throws must provide valid options
	* @throws when using sampling to generate initial centroids, the sample size must be greater than or equal to the number of clusters
	* @returns accumulator function
	*
	* @example
	* var Float64Array = require( '@stdlib/array-float64' );
	* var ndarray = require( '@stdlib/ndarray-ctor' );
	*
	* // Define initial centroid locations:
	* var buffer = [
	*     0.0, 0.0,
	*     1.0, 1.0,
	*     1.0, -1.0,
	*     -1.0, -1.0,
	*     -1.0, 1.0
	* ];
	* var shape = [ 5, 2 ];
	* var strides = [ 2, 1 ];
	* var offset = 0;
	* var order = 'row-major';
	*
	* var centroids = ndarray( 'float64', buffer, shape, strides, offset, order );
	*
	* // Create a k-means accumulator:
	* var accumulator = ns.incrkmeans( centroids );
	*
	* var out = accumulator();
	* // returns {...}
	*
	* // Create a data vector:
	* buffer = new Float64Array( 2 );
	* shape = [ 2 ];
	* strides = [ 1 ];
	*
	* var vec = ndarray( 'float64', buffer, shape, strides, offset, order );
	*
	* // Provide data to the accumulator:
	* vec.set( 0, 2.0 );
	* vec.set( 1, 1.0 );
	*
	* out = accumulator( vec );
	* // returns {...}
	*
	* vec.set( 0, -5.0 );
	* vec.set( 1, 3.14 );
	*
	* out = accumulator( vec );
	* // returns {...}
	*
	* // Retrieve the current cluster results:
	* out = accumulator();
	* // returns {...}
	*/
	incrkmeans: typeof incrkmeans;

	/**
	* Online learning for regression using stochastic gradient descent (SGD).
	*
	* ## Method
	*
	* The sub-gradient of the loss function is estimated for each datum and the regression model is updated incrementally, with a decreasing learning rate and regularization of the feature weights based on L2 regularization.
	*
	* ## References
	*
	* -   Shalev-Shwartz, S., Singer, Y., Srebro, N., & Cotter, A. (2011). Pegasos: Primal estimated sub-gradient solver for SVM. Mathematical Programming, 127(1), 3–30. doi:10.1007/s10107-010-0420-4
	*
	* @param options - options object
	* @param options.epsilon - insensitivity parameter (default: 0.1)
	* @param options.eta0 - constant learning rate (default: 0.02)
	* @param options.lambda - regularization parameter (default: 1e-3)
	* @param options.learningRate - string denoting the learning rate to use. Can be `constant`, `pegasos`, or `basic` (default: 'basic')
	* @param options.loss - string denoting the loss function to use. Can be `squaredError`, `epsilonInsensitive`, or `huber` (default: 'squaredError')
	* @param options.intercept - boolean indicating whether to include an intercept (default: true)
	* @throws must provide valid options
	* @returns regression model
	*
	* @example
	* var ns.incrSGDRegression = require( '@stdlib/streams-ml-incr-sgd-regression' );
	*
	* var accumulator = ns.incrSGDRegression({
	*     'intercept': true
	*     'lambda': 1e-5
	* });
	*
	* // Update model as observations come in:
	* var y = 3.5;
	* var x = [ 2.3, 1.0, 5.0 ];
	* accumulator( x, y );
	*
	* // Predict new observation:
	* var yHat = accumulator.predict( x );
	*
	* // Retrieve coefficients:
	* var coefs = accumulator.coefs;
	*/
	incrSGDRegression: typeof incrSGDRegression;
}

/**
* Incremental machine learning algorithms.
*/
declare var ns: Namespace;


// EXPORTS //

export = ns;
