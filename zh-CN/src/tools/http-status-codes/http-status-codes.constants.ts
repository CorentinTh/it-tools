export const codesByCategories: {
  category: string
  codes: {
    code: number
    name: string
    description: string
    type: 'HTTP' | 'WebDav'
  }[]
}[] = [
  {
    category: '1xx 消息',
    codes: [
      {
        code: 100,
        name: 'Continue 继续',
        description: '客户端应当继续发送请求。这个临时响应是用来通知客户端它的部分请求已经被服务器接收，且仍未被拒绝。客户端应当继续发送请求的剩余部分，或者如果请求已经完成，忽略这个响应。服务器必须在请求完成后向客户端发送一个最终响应。',
        type: 'HTTP',
      },
      {
        code: 101,
        name: 'Switching Protocols 切换协议',
        description: '服务器已经理解了客户端的请求，并将通过Upgrade 消息头通知客户端采用不同的协议来完成这个请求。在发送完这个响应最后的空行后，服务器将会切换到在Upgrade 消息头中定义的那些协议。只有在切换新的协议更有好处的时候才应该采取类似措施。例如，切换到新的HTTP 版本比旧版本更有优势，或者切换到一个实时且同步的协议以传送利用此类特性的资源。',
        type: 'HTTP',
      },
      {
        code: 102,
        name: 'Processing 正在处理',
        description: '这个状态码表示服务器已经收到了客户端的请求，正在处理，但暂时还没有可接触的响应。可以用于防止客户端超时并假设请求丢失。',
        type: 'WebDav',
      },
      {
        code: 103,
        name: '预返回',
        description: '服务器在最终 HTTP 消息之前返回一些响应标头。常和 HTTP Header: Link 一起使用，让客户端在服务器还在准备（当前的这个）响应时开始预加载（这个响应的结果需要用到的其他）资源。',
        type: 'HTTP',
      },
    ],
  },
  {
    category: '2xx 成功',
    codes: [
      {
        code: 200,
        name: 'OK 成功',
        description: '请求已成功，请求所希望的响应头或数据体将随此响应返回。话不多说，这个状态码应该是最最最常用的了，无人不知，无人不晓；就是表示请求成功的意思，你若安好，便是晴天。',
        type: 'HTTP',
      },
      {
        code: 201,
        name: 'Created 已创建',
        description: '客户端的请求已经成功完成，结果是创建了一个新资源，通常用于响应「增删改查」里的「增」。如果是严格按照 RESEful style 的 API，那么当客户端的 POST 请求成功后，服务器端就应该返回这个状态码。',
        type: 'HTTP',
      },
      {
        code: 202,
        name: 'Accepted 已接受',
        description: '请求已被接受处理，但处理尚未完成。表示服务器已经接受了这个请求，但是还不确定这个请求是否能够成功地被处理完。该请求最终可能会或可能不会被执行，并且在处理发生时可能会被拒绝，这是不确定的。在 HTTP 这种无状态的协议中，也是没有办法稍后再发送当前这个请求结果的异步响应；所以发送请求的客户端稍后可能会使用其他方式来取得这个请求的响应结果，或者是服务器以一种其他方式来通知客户端结果（例如，邮件）。',
        type: 'HTTP',
      },
      {
        code: 203,
        name: 'Non-Authoritative Information 非授权信息',
        description: 'Non-Authoritative Informative 直译过来是「非权威信息」的意思，这个状态码意味着当前响应的数据不完全与源服务器相同。它通常是由中间服务器（比如，一个代理服务器）返回给客户端的，这确实颇有「非权威信息」的意味，因为中间服务器接收到源服务器响应后，对其进行了一些修改💩，所以源服务器的响应具体是什么，发请求的客户端是完全不知情的😣。',
        type: 'HTTP',
      },
      {
        code: 204,
        name: 'No Content 无内容',
        description: '服务器成功处理了请求，并且没有返回任何内容。表示服务器成功地处理了客户端的请求，但是没有任何要响应的内容。API 设计上，在用 PUT 请求更新某个资源成功后，后端可以在 HTTP 响应头部指示一些更新的相关信息，确实没必要再返回任何响应内容，这就是 204 No Content 常见的使用场景之一。',
        type: 'HTTP',
      },
      {
        code: 205,
        name: 'Reset Content 重置内容',
        description: '服务器指示重新初始化发送此请求的文档视图。表示服务器成功地处理了客户端的请求，要求客户端重置它发送请求时的文档视图。这个响应码跟 204 No Content 类似，也不返回任何内容。这个在当今异步请求，都是单页 Web App 的情况下，没有什么实用空间与场景，它所表示的功能可以由客户端程序独立实现。',
        type: 'HTTP',
      },
      {
        code: 206,
        name: 'Partial Content 部分内容',
        description: '由于客户端发送了范围标头，服务器仅传送部分资源。是当客户端请求时使用了 Range 头部，服务器端回复的响应，表示只响应一部分内容。',
        type: 'HTTP',
      },
      {
        code: 207,
        name: 'Multi-Status 多种状态',
        description: '接下来的消息正文是 XML 消息，可以包含许多单独的响应代码。代表之后的消息体将是一个XML消息，并且可能依照之前子请求数量的不同，包含一系列独立的响应代码。',
        type: 'WebDav',
      },
      {
        code: 208,
        name: 'Already Reported 已枚举',
        description: 'DAV 绑定的成员已在（多状态）响应的前面部分中枚举。',
        type: 'WebDav',
      },
      {
        code: 226,
        name: 'IM Used 已完成',
        description: '服务器已完成对资源的请求，响应是结果的表示。',
        type: 'HTTP',
      },
    ],
  },
  {
    category: '3xx 重定向',
    codes: [
      {
        code: 300,
        name: 'Multiple Choices 多种选择',
        description: '表示要完成请求，需要进一步操作。通常，这些状态代码用来重定向。被请求的资源有一系列可供选择的回馈信息，每个都有自己特定的地址和浏览器驱动的商议信息。用户或浏览器能够自行选择一个首选的地址进行重定向。',
        type: 'HTTP',
      },
      {
        code: 301,
        name: 'Moved Permanently 永久移动',
        description: '请求的网页已永久移动到新位置。服务器返回此响应(对 GET 或 HEAD 请求的响应)时，会自动将请求者转到新位置。',
        type: 'HTTP',
      },
      {
        code: 302,
        name: 'Found 临时移动',
        description: '服务器目前从不同位置的网页响应请求，但请求者应继续使用原有位置来进行以后的请求。请求的资源临时从不同的 URI响应请求。由于这样的重定向是临时的，客户端应当继续向原有地址发送以后的请求。只有在Cache-Control或Expires中进行了指定的情况下，这个响应才是可缓存的。',
        type: 'HTTP',
      },
      {
        code: 303,
        name: 'See Other 查看其他位置',
        description: '请求者应当对不同的位置使用单独的 GET 请求来检索响应时，服务器返回此代码。对应当前请求的响应可以在另一个 URI 上被找到，而且客户端应当采用 GET 的方式访问那个资源。这个方法的存在主要是为了允许由脚本激活的POST请求输出重定向到一个新的资源。这个新的 URI 不是原始资源的替代引用。同时，303响应禁止被缓存。当然，第二个请求（重定向）可能被缓存。',
        type: 'HTTP',
      },
      {
        code: 304,
        name: 'Not Modified 未修改',
        description: '自从上次请求后，请求的网页未修改过。 服务器返回此响应时，不会返回网页内容。如果客户端发送了一个带条件的 GET 请求且该请求已被允许，而文档的内容（自上次访问以来或者根据请求的条件）并没有改变，则服务器应当返回这个状态码。304响应禁止包含消息体，因此始终以消息头后的第一个空行结尾。',
        type: 'HTTP',
      },
      {
        code: 305,
        name: 'Use Proxy 使用代理',
        description: '请求者只能使用代理访问请求的网页。 如果服务器返回此响应，还表示请求者应使用代理。被请求的资源必须通过指定的代理才能被访问。Location 域中将给出指定的代理所在的 URI 信息，接收者需要重复发送一个单独的请求，通过这个代理才能访问相应资源。只有原始服务器才能建立305响应。',
        type: 'HTTP',
      },
      {
        code: 306,
        name: 'Switch Proxy 切换代理',
        description: '不再使用。 最初的意思是“后续请求应该使用指定的代理”。',
        type: 'HTTP',
      },
      {
        code: 307,
        name: 'Temporary Redirect 临时重定向',
        description: '服务器目前从不同位置的网页响应请求，但请求者应继续使用原有位置来进行以后的请求。',
        type: 'HTTP',
      },
      {
        code: 308,
        name: 'Permanent Redirect 永久重定向',
        description: '应使用另一个 URI 重复该请求和所有未来的请求。308与301定义一致，唯一的区别在于，308状态码不允许浏览器将原本为POST的请求重定向到GET请求上。',
        type: 'HTTP',
      },
    ],
  },
  {
    category: '4xx 客户端错误',
    codes: [
      {
        code: 400,
        name: 'Bad Request 错误请求',
        description: '服务器不理解请求的语法。语义有误，当前请求无法被服务器理解。除非进行修改，否则客户端不应该重复提交这个请求。',
        type: 'HTTP',
      },
      {
        code: 401,
        name: 'Unauthorized 未授权',
        description: '请求要求身份验证。对于需要登录的网页，服务器可能返回此响应。当前请求需要用户验证。该响应必须包含一个适用于被请求资源的 WWW-Authenticate 信息头用以询问用户信息。客户端可以重复提交一个包含恰当的 Authorization 头信息的请求。如果当前请求已经包含了 Authorization 证书，那么401响应代表着服务器验证已经拒绝了那些证书。如果401响应包含了与前一个响应相同的身份验证询问，且浏览器已经至少尝试了一次验证，那么浏览器应当向用户展示响应中包含的实体信息，因为这个实体信息中可能包含了相关诊断信息。',
        type: 'HTTP',
      },
      {
        code: 402,
        name: 'Payment Required 需要付款',
        description: '保留以供将来使用。最初的目的是该代码可以用作某种形式的数字现金或小额支付计划的一部分。',
        type: 'HTTP',
      },
      {
        code: 403,
        name: 'Forbidden 禁止',
        description: '请求有效，但服务器拒绝执行操作。用户可能没有资源的必要权限。',
        type: 'HTTP',
      },
      {
        code: 404,
        name: 'Not Found 未找到',
        description: '无法找到请求的资源，但将来可能可用。没有信息能够告诉用户这个状况到底是暂时的还是永久的。假如服务器知道情况的话，应当使用410状态码来告知旧资源因为某些内部的配置机制问题，已经永久的不可用，而且没有任何可以跳转的地址。404这个状态码被广泛应用于当服务器不想揭示到底为何请求被拒绝或者没有其他适合的响应可用的情况下。出现这个错误的最有可能的原因是服务器端没有这个页面。',
        type: 'HTTP',
      },
      {
        code: 405,
        name: 'Method Not Allowed 方法禁用',
        description: '请求行中指定的请求方法不能被用于请求相应的资源。该响应必须返回一个Allow 头信息用以表示出当前资源能够接受的请求方法的列表。',
        type: 'HTTP',
      },
      {
        code: 406,
        name: 'Not Acceptable 不接受',
        description: '无法使用请求的内容特性响应请求的网页。请求的资源的内容特性无法满足请求头中的条件，因而无法生成响应实体。',
        type: 'HTTP',
      },
      {
        code: 407,
        name: 'Proxy Authentication Required 需要代理授权',
        description: '此状态代码与 401(未授权)类似，但指定请求者应当授权使用代理。代理服务器必须返回一个 Proxy-Authenticate 用以进行身份询问。客户端可以返回一个 Proxy-Authorization 信息头用以验证。',
        type: 'HTTP',
      },
      {
        code: 408,
        name: 'Request Timeout 请求超时',
        description: '服务器等候请求时发生超时。客户端没有在服务器预备等待的时间内完成一个请求的发送。客户端可以随时再次提交这一请求而无需进行任何更改。',
        type: 'HTTP',
      },
      {
        code: 409,
        name: 'Conflict 冲突',
        description: '服务器在完成请求时发生冲突。 服务器必须在响应中包含有关冲突的信息。由于和被请求的资源的当前状态之间存在冲突，请求无法完成。这个代码只允许用在这样的情况下才能被使用：用户被认为能够解决冲突，并且会重新提交新的请求。该响应应当包含足够的信息以便用户发现冲突的源头。',
        type: 'HTTP',
      },
      {
        code: 410,
        name: 'Gone 已删除',
        description: '如果请求的资源已永久删除，服务器就会返回此响应。被请求的资源在服务器上已经不再可用，而且没有任何已知的转发地址。这样的状况应当被认为是永久性的。如果可能，拥有链接编辑功能的客户端应当在获得用户许可后删除所有指向这个地址的引用。如果服务器不知道或者无法确定这个状况是否是永久的，那么就应该使用404状态码。除非额外说明，否则这个响应是可缓存的。',
        type: 'HTTP',
      },
      {
        code: 411,
        name: 'Length Required 需要有效长度',
        description: '服务器拒绝在没有定义 Content-Length 头的情况下接受请求。在添加了表明请求消息体长度的有效 Content-Length 头之后，客户端可以再次提交该请求。',
        type: 'HTTP',
      },
      {
        code: 412,
        name: 'Precondition Failed 未满足前提条件',
        description: '服务器在验证在请求的头字段中给出先决条件时，没能满足其中的一个或多个。这个状态码允许客户端在获取资源时在请求的元信息（请求头字段数据）中设置先决条件，以此避免该请求方法被应用到其希望的内容以外的资源上。',
        type: 'HTTP',
      },
      {
        code: 413,
        name: 'Payload Too Large 请求实体过大',
        description: '服务器拒绝处理当前请求，因为该请求提交的实体数据大小超过了服务器愿意或者能够处理的范围。此种情况下，服务器可以关闭连接以免客户端继续发送此请求。',
        type: 'HTTP',
      },
      {
        code: 414,
        name: 'URI Too Long 请求的 URI 过长',
        description: '请求的URI 长度超过了服务器能够解释的长度，因此服务器拒绝对该请求提供服务。',
        type: 'HTTP',
      },
      {
        code: 415,
        name: 'Unsupported Media Type 不支持的媒体类型',
        description: '对于当前请求的方法和所请求的资源，请求中提交的实体并不是服务器中所支持的格式，因此请求被拒绝。',
        type: 'HTTP',
      },
      {
        code: 416,
        name: 'Range Not Satisfiable 请求范围不符合要求',
        description: '如果请求中包含了 Range 请求头，并且 Range 中指定的任何数据范围都与当前资源的可用范围不重合，同时请求中又没有定义 If-Range 请求头，那么服务器就应当返回416状态码。',
        type: 'HTTP',
      },
      {
        code: 417,
        name: 'Expectation Failed 未满足期望值',
        description: '在请求头 Expect 中指定的预期内容无法被服务器满足，或者这个服务器是一个代理服务器，它有明显的证据证明在当前路由的下一个节点上，Expect 的内容无法被满足。',
        type: 'HTTP',
      },
      {
        code: 418,
        name: 'I\'m a teapot 我是茶壶',
        description: '服务器拒绝冲泡咖啡，因为它永远是一个茶壶。暂时没有咖啡的组合咖啡/茶壶应该返回 503。此错误引用了 1998 年和 2014 年愚人节笑话中定义的超文本咖啡壶控制协议。 一些网站使用此响应来处理他们不希望处理的请求，例如自动查询。',
        type: 'HTTP',
      },
      {
        code: 421,
        name: 'Misdirected Request 错误的请求',
        description: '请求被定向到一个无法生成响应的服务器。如果连接被重复使用或选择了其他服务，则可能会出现这种情况。',
        type: 'HTTP',
      },
      {
        code: 422,
        name: 'Unprocessable Entity 无法处理的实体',
        description: '服务器理解请求实体的内容类型，并且请求实体的语法是正确的，但是服务器无法处理所包含的指令。',
        type: 'HTTP',
      },
      {
        code: 423,
        name: 'Locked 已锁定',
        description: '暂定目标资源被锁定，即无法访问。其内容应包含一些WebDAV XML格式的信息。',
        type: 'HTTP',
      },
      {
        code: 424,
        name: 'Failed Dependency 依赖失败',
        description: '由于请求的操作依赖于另一个操作，且该操作因此失败，无法在资源上执行该方法。',
        type: 'HTTP',
      },
      {
        code: 425,
        name: 'Too Early 太早了',
        description: '服务器不愿意冒风险来处理该请求，原因是处理该请求可能会被“重放”，从而造成潜在的重放攻击。',
        type: 'HTTP',
      },
      {
        code: 426,
        name: 'Upgrade Required 需要升级',
        description: '服务器拒绝处理客户端使用当前协议发送的请求，但是可以接受其使用升级后的协议发送的请求。',
        type: 'HTTP',
      },
      {
        code: 428,
        name: 'Precondition Required 需要先决条件',
        description: '源服务器要求请求是有条件的。',
        type: 'HTTP',
      },
      {
        code: 429,
        name: 'Too Many Requests 请求过多',
        description: '在一定的时间内用户发送了过多的请求，即超出了“频次限制”。',
        type: 'HTTP',
      },
      {
        code: 431,
        name: 'Request Header Fields Too Large 请求标头字段太大',
        description: '由于请求中的首部字段的值过大，服务器拒绝接受客户端的请求。客户端可以在缩减首部字段的体积后再次发送请求。',
        type: 'HTTP',
      },
      {
        code: 451,
        name: 'Unavailable For Legal Reasons 因法律原因不可用',
        description: '服务器由于法律原因，无法提供客户端请求的资源，例如可能会导致法律诉讼的页面。',
        type: 'HTTP',
      },
    ],
  },
  {
    category: '5xx 服务器错误',
    codes: [
      {
        code: 500,
        name: 'Internal Server Error 内部服务器错误',
        description: '服务器遇到了一个未曾预料的状况，导致了它无法完成对请求的处理。一般来说，这个问题都会在服务器端的源代码出现错误时出现。',
        type: 'HTTP',
      },
      {
        code: 501,
        name: 'Not Implemented 尚未实施',
        description: '服务器不支持当前请求所需要的某个功能。当服务器无法识别请求的方法，并且无法支持其对任何资源的请求。',
        type: 'HTTP',
      },
      {
        code: 502,
        name: 'Bad Gateway 错误网关',
        description: '作为网关或者代理工作的服务器尝试执行请求时，从上游服务器接收到无效的响应。',
        type: 'HTTP',
      },
      {
        code: 503,
        name: 'Service Unavailable 服务不可用',
        description: '由于临时的服务器维护或者过载，服务器当前无法处理请求。这个状况是临时的，并且将在一段时间以后恢复。如果能够预计延迟时间，那么响应中可以包含一个 Retry-After 头用以标明这个延迟时间。如果没有给出这个 Retry-After 信息，那么客户端应当以处理500响应的方式处理它。',
        type: 'HTTP',
      },
      {
        code: 504,
        name: 'Gateway Timeout 网关超时',
        description: '作为网关或者代理工作的服务器尝试执行请求时，未能及时从上游服务器（URI标识出的服务器，例如HTTP、FTP、LDAP）或者辅助服务器（例如DNS）收到响应。',
        type: 'HTTP',
      },
      {
        code: 505,
        name: 'HTTP Version Not Supported HTTP版本不受支持',
        description: '服务器不支持，或者拒绝支持在请求中使用的 HTTP 版本。这暗示着服务器不能或不愿使用与客户端相同的版本。响应中应当包含一个描述了为何版本不被支持以及服务器支持哪些协议的实体。',
        type: 'HTTP',
      },
      {
        code: 506,
        name: 'Variant Also Negotiates 内部配置错误',
        description: '由《透明内容协商协议》（RFC 2295）扩展，代表服务器存在内部配置错误：被请求的协商变元资源被配置为在透明内容协商中使用自己，因此在一个协商处理中不是一个合适的重点。',
        type: 'HTTP',
      },
      {
        code: 507,
        name: 'Insufficient Storage 存储空间不足',
        description: '服务器无法存储完成请求所必须的内容。这个状况被认为是临时的。WebDAV (RFC 4918)',
        type: 'HTTP',
      },
      {
        code: 508,
        name: 'Loop Detected 检测到循环',
        description: '当服务器检测到无限循环的情况时，会返回此状态码。例如，在WebDAV的MOVE或COPY操作中，如果目标URL和源URL形成循环引用，服务器就会返回508状态码。',
        type: 'HTTP',
      },
      {
        code: 510,
        name: 'Not Extended 未被扩展',
        description: '服务器不支持请求中所需要的HTTP扩展。换言之，客户端在请求中使用了服务器不支持的HTTP扩展，因此服务器无法处理该请求并返回了510状态码。',
        type: 'HTTP',
      },
      {
        code: 511,
        name: 'Network Authentication Required 需要网络验证',
        description: '客户端需要通过验证才能使用该网络。它通常由拦截代理服务器（并非原始服务器）生成，用于控制对网络的访问。网络运营商在准许使用网络之前，有时需要进行身份验证、接受某些条款，或者进行其他形式的与用户之间的互动，他们通常会用用户设备的MAC地址来进行识别。',
        type: 'HTTP',
      },
    ],
  },
];
