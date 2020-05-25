
import { setPublicPath } from 'systemjs-webpack-interop';
<% if(isTs){%>(<any>window)<%}else{%>window<%}%>.__SINGLE_SPA_MFE__ && setPublicPath('<%=appName%>')
