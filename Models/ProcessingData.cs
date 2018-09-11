using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace olhrk_web.Models
{
    public class ProcessingData
    {
        public string data_name
        {
            get;
            set;
        }
        public string data_type
        {
            get;
            set;
        }
        public string data
        {
            get;
            set;
        }


        private byte[] StringToByte(string str)
        {
            byte[] result = new byte[str.Length / 2];

            int[] numbers = { 0, 0 };
            for (int i = 0; i < str.Length; i++)
            {
                numbers[i % 2] = CharToNumber(str[i]);
                if (i % 2 == 1)
                {
                    result[i / 2] = (byte)(numbers[0] << 8 | numbers[1]);
                }
            }
            return result;
        } 

        private int CharToNumber(char value)
        {
            int result;
            result = 0;
            if (value >= 'A')
            {
                result = value - 'A' + 10;
            }
            else if (value >= 'a')
            {
                result = value - 'a' + 10;
            }
            else if (value >= '0')
            {
                result = value - '0';
            }
            else
            {
                throw new ArgumentException();
            }
            return result;
        }

    }
}