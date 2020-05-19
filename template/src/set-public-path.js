import { setPublicPath } from 'systemjs-webpack-interop';

<% if(isTs) {%>(<any>window)<% } else {%>window<%} %>.__STL_S_SPA__&&setPublicPath('<%=appName%>');
