require("dotenv").config();
const superagent = require("superagent");
const AWS = require("aws-sdk");
const fs = require("fs/promises");

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

function getAppointmentsByZip(zip) {
  return superagent
    .post(
      "https://www.cvs.com/Services/ICEAGPV1/immunization/1.0.0/getIMZStores"
    )
    .send({
      requestMetaData: {
        appName: "CVS_WEB",
        lineOfBusiness: "RETAIL",
        channelName: "WEB",
        deviceType: "DESKTOP",
        deviceToken: "7777",
        apiKey: "a2ff75c6-2da7-4299-929d-d670d827ab4a",
        source: "ICE_WEB",
        securityType: "apiKey",
        responseFormat: "JSON",
        type: "cn-dep",
      },
      requestPayloadData: {
        selectedImmunization: ["CVD"],
        distanceInMiles: 35,
        imzData: [
          {
            imzType: "CVD",
            ndc: ["59267100002", "59267100003", "59676058015", "80777027399"],
            allocationType: "1",
          },
        ],
        searchCriteria: { addressLine: zip },
      },
    })
    .set("authority", "www.cvs.com")
    .set("pragma", "no-cache")
    .set("cache-control", "no-cache")
    .set(
      "sec-ch-ua",
      '"Google Chrome";v="89", "Chromium";v="89", ";Not A Brand";v="99"'
    )
    .set("accept", "application/json")
    .set("sec-ch-ua-mobile", "?0")
    .set(
      "user-agent",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36"
    )
    .set("content-type", "application/json")
    .set("origin", "https://www.cvs.com")
    .set("sec-fetch-site", "same-origin")
    .set("sec-fetch-mode", "cors")
    .set("sec-fetch-dest", "empty")
    .set(
      "referer",
      "https://www.cvs.com/vaccine/intake/store/cvd-store-select/first-dose-select"
    )
    .set(
      "accept-language",
      "en-US,en;q=0.9,es-US;q=0.8,es;q=0.7,ja-JP;q=0.6,ja;q=0.5"
    )
    .set(
      "cookie",
      "adh_ps_pickup=on; DG_SID=65.24.247.253:cLb21Vt3+nTMLyQhri6TU9I1PmzRmGFxPHaCFAtf2OU; DYN_USER_ID=8rD85BjW71w36DA6cw1Adg--; DYN_USER_CONFIRM=1d88e0788db6ac5265814580c11fb716; DYN_COOKIE=DyHr7Te4MTaKLr%2BbWpmVhcS%2B%2FY3BPC3G3E4xbvcU5lAhJWPTSqWhMPeCG6%2FGNsLC%2Bvn80gQHPnBH%0ACpo9lK44Yw%3D%3D; snapfish.user.previousLogin=true; AMCV_DDAC5B3B52FE550A0A490D44%40AdobeOrg=359503849%7CMCIDTS%7C18623%7CMCMID%7C32916151153802097526805337602368048389%7CMCAID%7CNONE%7CMCOPTOUT-1609033987s%7CNONE%7CvVersion%7C5.0.1; pe=p1; acctdel_v1=on; adh_new_ps=on; adh_ps_refill=on; buynow=off; sab_displayads=on; dashboard_v1=off; db-show-allrx=on; disable-app-dynamics=on; disable-sac=on; dpp_cdc=off; dpp_drug_dir=off; dpp_sft=off; getcust_elastic=on; echomeln6=off-p0; enable_imz=on; enable_imz_cvd=on; enable_imz_reschedule_instore=off; enable_imz_reschedule_clinic=off; flipp2=on; gbi_cvs_coupons=true; ice-phr-offer=off; v3redirecton=false; mc_cloud_service=on; mc_hl7=on; mc_home_new=off1; mc_ui_ssr=off-p2; mc_videovisit=on; memberlite=on; pauth_v1=on; pivotal_forgot_password=off-p0; pivotal_sso=off-p0; pbmplaceorder=off; pbmrxhistory=on; ps=on; refill_chkbox_remove=off-p0; rxdanshownba=off; rxdfixie=on; rxd_bnr=on; rxd_dot_bnr=on; rxdpromo=on; rxduan=on; rxlite=on; rxlitelob=off; rxm=on; rxm_phone_dob=off-p1; rxm_demo_hide_LN=off; rxm_phdob_hide_LN=on; rxm_rx_challenge=on; s2c_akamaidigitizecoupon=on; s2c_beautyclub=off-p0; s2c_digitizecoupon=on; s2c_dmenrollment=off-p0; s2c_herotimer=off-p0; s2c_newcard=off-p0; s2c_papercoupon=on; s2c_persistEcCookie=on; s2c_smsenrollment=on; s2cHero_lean6=on; sft_mfr_new=on; sftg=on; show_exception_status=on; v2-dash-redirection=on; hpr_login=true; ak_bmsc=D8F4258D062D7A7B40891D5C5488047117201187E94B00005B29516093295E0C~plPSTV5odoDhy/nAIzQ0xFUHyr+8mCnj2dUIwwFFrRWdmREMOocJEjOkJv87yNtZ5de/fPDt1m5ZUKQikuKGLwrJbELNsoSOs1rv2TaJH9U4eyIy7V4a20abgXhuFgY1iS7OQPWtPTb+M2oBFc8anSQEseaMkSQwbINPQshZ+pwMva7HtQ2DlrOrUYIS0sR76/HH7iAvsPgHxWrLPIEBRKeRcRsVvaBCvoxh56o8fFFe4=; bm_sz=43EF665F0F8122295154F39D63418BBB~YAAQhxEgFxjOyhN4AQAAw4wJPQvjO+gXS5ZsPGLvQ9x74XN5PEbVdesPt/HPg6FYYfE5qNm+HqnmnyTowA92HDdnWXA7XKdP1DsHx1giOqy/ESbqP3zx3UAnVPT06MopQUd3tb1J+nYlAwhCFXUoIdsYdB/Ch3GHuQnr7OPfHDWS+bLZPVkFxo9sxXJu; _group1=quantum; AMCVS_06660D1556E030D17F000101%40AdobeOrg=1; AMCV_06660D1556E030D17F000101%40AdobeOrg=-330454231%7CMCIDTS%7C18703%7CMCMID%7C08415471332714524472159143377735398003%7CMCAID%7CNONE%7CMCOPTOUT-1615938939s%7CNONE%7CvVersion%7C3.1.2; JSESSIONID=fHFc-AD1yEr39Xz-O0plt9Y6K_TFQzUM_kUmjo3G.commerce_1104; _abck=AC0C37C5723D18B29E08AB8AD7FDD2E3~0~YAAQhxEgF0TOyhN4AQAAgpUJPQWmmnQ28tHEgYG3dWvDsJ0HSkwuyGbrE+EI00I747EsnDeKXWRFUKiwcZZi3W3ZHKVp4BfLucb3La/PwK464l5Qrh3q1qqR4SEZWdUO8LJeE5ybUn3xPx+1MHriLRxOeJ6bzoMDvGJIloBrBAyOyrBXbiK0txsPM3OZMzsuFJ2ZIHbB4CJbJ6oS6sJMw6ckPomwLNYSgWwaa6b2YWnmQAW+2c7cgHz0OP1C0V6o1gLr0qayr3HxVQbcXAcu4di51skG3bxb8strZwCmr0jgvXWXpNlJpZjVeoTmb8KNJ7TINZuY0IubLkLZ5+u5mBl/j/9Lnlq7joHaUgsX8Yp6lsg60k8H1jAbmiYkj7ylxZm1gfQfFy4gv7gRJHKFL5dIO/Z2~-1~||-1||~-1; gbi_sessionId=ckmck1bsn00003g7sz8naohp0; gbi_visitorId=ckmck1bso00013g7s6hfhv7de; CVPF=CT-2; akavpau_vp_www_cvs_com_vaccine=1615932708~id=1059c28981391b03f8460ebff44f9ae3; akavpau_vp_www_cvs_com_vaccine_covid19=1615932708~id=1059c28981391b03f8460ebff44f9ae3; akavpau_www_cvs_com_general=1615932529~id=7d289c46efb56b888dbefe87261f771d; utag_main=v_id:0176a1356509001dcd12412f097903078002e07000bd0$_sn:3$_se:4$_ss:0$_st:1615933909318$vapi_domain:cvs.com$_pn:4%3Bexp-session$ses_id:1615931739788%3Bexp-session; bm_sv=2770485B4D99D8E8D08F0E67A22216B2~8xSvu1YM56Xh9mgorSyQa8l5p1MMWUwDL1VlfJNNA07EIfAW5EoLzaPemBY3CQ/+XeWJKsVzCWe+psbMJGnqIChA7T5Sk3l1ytBgwLnUv/C1GQqBDDOYZYLr2oXrpr1FJoAtn7ZdbrbTspLnqV0ZKQ=="
    )
    .set("sec-gpc", "1")
    .set("Content-Type", "text/plain")
    .set(
      "Cookie",
      "ADRUM_BT=R:75|i:1684|g:1b0a3ce6-8166-4846-87ae-31110665121246185|e:264|n:customer1_d6c575ca-3f03-4481-90a7-5ad65f4a5986; bm_sv=2770485B4D99D8E8D08F0E67A22216B2~8xSvu1YM56Xh9mgorSyQa8l5p1MMWUwDL1VlfJNNA07EIfAW5EoLzaPemBY3CQ/+XeWJKsVzCWe+psbMJGnqIChA7T5Sk3l1ytBgwLnUv/BZcECotStUWlouNo3CDBcCsNnknv1v7HXTM7i8KgjwZA==; _abck=AC0C37C5723D18B29E08AB8AD7FDD2E3~-1~YAAQoxEgF3dc/jJ4AQAAI2BNPQVidmy57A+FQzLq6m0KFa1clFmvEkzNzXclADFOpm3zXAABCpox39Vi3liXuQdh6nwwDjECfB/pDqsquo37jK8TjIymbebRfbzyxUCNq+HIcGepno3vn6WWS1ywlNlF/eg/AbFK6/WC8iAKjg7MJc69GJzUXMXPg+tsQyeWMGz87ID29lOh2ByJhU4+EFzJ6MjtatKBTnBkQ+oKy/bCIKpMt5wDmeLYMUxX1DlL+sUBU9MVKTRjhqZiqJRkC29G6/XAoAXfvwupRsRIcXVwHqU91EhbWkHEhyCG0oo+T7c2Mw8plAHtnw0eDin/FSMKiUQJXdJ1IX62f8zNjyI0wqx+oIUCT9jfL+9+NXfffoQUWVeb39RS9evVoEtCktDaPvyH~0~-1~-1"
    );
}

exports.handler = async (event, context, callback) => {
  let zipCodes = (await fs.readFile("zip_codes.txt")).toString().split("\n");

  for (let zipCode of zipCodes) {
    try {
      console.log("trying " + zipCode);
      let res = await getAppointmentsByZip(zipCode);
      console.log(res.body);
    } catch (error) {
      console.log(error);
    }
  }
};

exports.handler();
