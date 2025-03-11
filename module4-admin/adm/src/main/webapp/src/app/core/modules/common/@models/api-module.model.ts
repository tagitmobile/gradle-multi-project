export class MxApiModule {
    constructor(
        private name,
        private url,
        private urls,
        private baseUrl,
        private appKey,
    ) {
    }
    getUrl(name) {
        const apiUrl = this.urls.find(url => url.name === name);
        if (apiUrl) {
            return this.baseUrl + '/' + this.url  + '/' + apiUrl.url;
        } else {
            return null;
        }
    }
}
