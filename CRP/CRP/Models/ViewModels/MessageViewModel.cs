using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CRP.Models.JsonModel
{
    public class MessageViewModel
    {
        public string Message { get; set; } = "Ok";

        public int Status { get; set; } = 0;

        public Object Data { get; set; } = null;
    }
}