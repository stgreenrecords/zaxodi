<%@page session="false" contentType="text/html; charset=UTF-8" %>
<%--
  Copyright 1997-2010 Day Management AG
  Barfuesserplatz 6, 4001 Basel, Switzerland
  All Rights Reserved.

  This software is the confidential and proprietary information of
  Day Management AG, ("Confidential Information"). You shall not
  disclose such Confidential Information and shall use it only in
  accordance with the terms of the license agreement you entered into
  with Day.

  ==============================================================================

  Newsletter body script.

  ==============================================================================
--%>
<%@page import="com.day.cq.widget.HtmlLibraryManager" %>
<%@include file="/libs/foundation/global.jsp" %>

<body style="background-color:#292826; margin:0; paddindg:0;">
<cq:include path="clickstreamcloud" resourceType="cq/personalization/components/clientcontext"/>


<table cellpadding="0" cellspacing="0" border="0" id="backgroundTable"
       style="font-family: Arial, Helvetica, sans-serif; background-color: #292826; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; margin: 0 auto;">
    <tr>
        <td height="30"><cq:include script="actionstoolbar.jsp"/></td>
    </tr>
    <tr style="background-color:#3D3D3D;">
        <td height="30" style="background-color:#3D3D3D; font-size:11px; color: #B3B3B3;">
            <table cellpadding="0" cellspacing="0" border="0" align="center" width="100%">
                <tr>
                    <td style="background-color:#3D3D3D;text-align: center;">
                        <span style="font-family: Arial, Helvetica, sans-serif; font-size:11px; color: #B3B3B3;">Добро пожаловать на zaxodi.tk</span>
                        <a href="#" title="View in a browser"
                           style="text-decoration: none; font-family: Arial, Helvetica, sans-serif; font-size:11px; color: #EE5A29; padding:0; margin:0;">Посмотреть
                            в браузере &rsaquo;</a>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
    <tr>
        <td valign="top">
            <table cellpadding="0" cellspacing="0" border="0" align="center" width="100%"
                   style="border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;margin: 0 auto;">
                <tr>
                    <td valign="top" colspan="3" style="background-color: #F2F2F2">
                        <cq:include path="par" resourceType="/libs/foundation/components/parsys"/>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
<cq:include path="cloudservices" resourceType="cq/cloudserviceconfigs/components/servicecomponents"/>
</body>
