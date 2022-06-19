import layout from './layout/layout'

/* eslint-disable max-len */
const userInvited = (
    header: string,
    content: string,
    buttonText: string,
    buttonLink: string
) =>
    layout(`<tr
                            style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0; font-size: 14px;   border: 1px solid #e9e9e9;">
                            <td class="content-wrap"
                                style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 20px; color:#fff; border-radius: 3px; background-color: #F2994A;"
                                valign="top">
                                ${header}
                            </td>
                        </tr>
                        <tr style="box-sizing: border-box; height:12px">
                            <td> </td>
                        </tr>
                        <tr
                            style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0; font-size: 14px; border-radius: 3px; background-color: #fff; border: 1px solid #e9e9e9;">
                            <td class="content-wrap"
                                style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 20px;"
                                valign="top">
                                <meta itemprop="name" content="Accept invitation"
                                    style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;" />
                                <table width="100%" cellpadding="0" cellspacing="0"
                                    style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                                    <tr
                                        style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                                        <td class="content-block"
                                            style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;"
                                            valign="top">
                                            ${content}
                                        </td>
                                    </tr>
                                    <tr
                                        style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                                        <td class="content-block" itemprop="handler" itemscope
                                            itemtype="http://schema.org/HttpActionHandler"
                                            style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;"
                                            valign="top">
                                            <a href="${buttonLink}" class="btn-primary" itemprop="url"
                                                style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; color: #FFF; text-decoration: none; line-height: 2em; font-weight: bold; text-align: center; cursor: pointer; display: inline-block; border-radius: 5px; background-color: #F2994A; margin: 0; border-color: #F2994A; border-style: solid; border-width: 5px 10px;">${buttonText}</a>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
`)
/* eslint-enable max-len */

export default userInvited
