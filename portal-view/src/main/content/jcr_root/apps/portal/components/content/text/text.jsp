<%@page contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
<%@include file="/libs/foundation/global.jsp"%>
<cq:setContentBundle/>

<fmt:message var="textPlaceholder" key="component.text.placeholder" />


<cq:text property="text" tagName="div" tagClass="text"
        placeholder="${textPlaceholder}"/>
