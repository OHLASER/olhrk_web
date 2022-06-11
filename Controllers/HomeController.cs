using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using System.Web.Script.Serialization;

namespace olhrk_web.Controllers
{
    // [Authorize]
    public class HomeController : Controller
    {

        /// <summary>
        /// data link client
        /// </summary>
        private oldlclr.Client DataLinkValue;

        /// <summary>
        /// data link client
        /// </summary>
        internal oldlclr.Client DataLink
        {
            get
            {
                if (DataLinkValue == null)
                {
                    DataLinkValue = new oldlclr.Client();
                }
                return DataLinkValue;
            }
        }


        public HomeController()
            : base()
        {
            
        }

        public ActionResult Index()
        {
            return View();
        }


        public ActionResult Status()
        {


            oldlclr.Status status;
            status = null;
            if (DataLink.Connect())
            {
                status = DataLink.GetStatus();
                DataLink.Disconnect();
            }
            else
            {
                oldlclr.Error.SetError(oldlclr.ErrorCode.NOT_COMMUNICATE);
            }

            JsonResult result;
            object obj;
            obj = null;

            if (status != null)
            {
                JavaScriptSerializer ser;
                ser = new JavaScriptSerializer();
                obj = ser.Deserialize(status.ToJson(), typeof(object));
            }
            else
            {
                JavaScriptSerializer ser;
                ser = new JavaScriptSerializer();
                obj = ser.Deserialize(oldlclr.Error.GetErrorAsJson(), typeof(object));
            }
            result = Json(obj, JsonRequestBehavior.AllowGet);

            if (status != null)
            {
                status.Dispose();
            }

            return result;
        }
        [HttpPost]
        public ActionResult Load(olhrk_web.Models.ProcessingData procData)
        {
            JsonResult result;
            System.Console.WriteLine(this.HttpContext.Request);
            

            if (DataLink.Connect())
            {
                string strData;
                byte[] hexData;
                hexData = HexStrToByteArray(procData.data);

                strData = System.Text.Encoding.UTF8.GetString(hexData);

                System.Console.Out.WriteLine(strData);


                JavaScriptSerializer ser;
                ser = new JavaScriptSerializer();
                string strProcData;
                try
                {
                    strProcData = ser.Serialize(procData);
                    byte[] data;
                    data = System.Text.Encoding.UTF8.GetBytes(strProcData);

                    if (DataLink.LoadData(data, procData.data_name))
                    {
                        oldlclr.Error.SetError(oldlclr.ErrorCode.NO_ERROR);
                    }
                }
                catch (InvalidOperationException ex)    // for having data length over ser.MaxJsonLength
                {
                    oldlclr.Error.SetError(oldlclr.ErrorCode.UNEXPECTED_STATUS);
                }
            }
            else
            {
                oldlclr.Error.SetError(oldlclr.ErrorCode.NOT_COMMUNICATE);
            }
            {
                JavaScriptSerializer ser;
                ser = new JavaScriptSerializer();
                object obj;
                string jsonErrorStr;
                jsonErrorStr = oldlclr.Error.GetErrorAsJson();
                if (jsonErrorStr != null)
                {
                    obj = ser.Deserialize(jsonErrorStr, typeof(object));
                    result = Json(obj);
                }
                else
                {
                    result = Json(new object() { });
                }
            }

            return result;

        }


        byte[] HexStrToByteArray(string hexStr)
        {
            byte[] result;
            result = new byte[hexStr.Length / 2];

            int tmpValue;
            tmpValue = 0;
            for (int idx = 0; idx < hexStr.Length; idx++)
            {
                char aData;
                aData = hexStr[idx];
                int intValue;
                intValue = (int)HexToInt(aData);

                if (idx % 2 == 1)
                {
                    result[idx / 2] = (byte)((tmpValue << 4) | intValue);
                }
                else
                {
                    tmpValue = intValue;
                }
            }
            return result;
        }

        int? HexToInt(char hexData)
        {
            int? result;
            result = null;

            if ('F' >= hexData && hexData >= 'A')
            {
                result = hexData - 'A' + 10;
            }
            else if ('f' >= hexData && hexData >= 'a')
            {
                result = hexData - 'a' + 10;
            }
            else if (hexData >= '0')
            {
                result = hexData - '0';
            }
            else
            {
               
            }
            return result;
        }

    }
}
