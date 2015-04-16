// Copyright (c) 2015 Uber Technologies, Inc.

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

'use strict';

var errors = require('./errors');

function TChannelServiceNameHandler(channel) {
    if (!(this instanceof TChannelServiceNameHandler)) {
        return new TChannelServiceNameHandler(channel);
    }
    var self = this;
    self.channel = channel;
}

TChannelServiceNameHandler.prototype.type = 'tchannel.service-name-handler';

TChannelServiceNameHandler.prototype.handleRequest = function handleRequest(req, buildRes) {
    var self = this;
    if (!req.service) {
        buildRes().sendError('BadRequest', 'no service name given');
        return;
    }
    var chan = self.channel.subChannels[req.service];
    if (chan) {
        chan.handler.handleRequest(req, buildRes);
    } else {
        self.handleDefault(req, buildRes);
    }
};

TChannelServiceNameHandler.prototype.handleDefault = function handleDefault(req, buildRes) {
    var err = errors.NoServiceHandlerError({service: req.service});
    buildRes().sendError('BadRequest', err.message);
};

TChannelServiceNameHandler.prototype.register = function register() {
    throw errors.TopLevelRegisterError();
};

module.exports = TChannelServiceNameHandler;
