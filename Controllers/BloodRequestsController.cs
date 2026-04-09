using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using BloodBridge.Model;
using BloodBridge.DTOs;
using BloodBridge.DTOs.AuthDtos;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using BloodBridge.DTOs.BloodRequestDTOS;
namespace BloodBridge.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BloodRequestsController : ControllerBase
    {
        private BloodBridgeDbContext _dbContext;
        public BloodRequestsController(BloodBridgeDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        [HttpPost("CreateRequest")]
        [Authorize(Roles = "Hospital")]
        public async Task<IActionResult> CreateRequest([FromBody] BloodRequestDto dto)
        {
            var userIdString=User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var userId = int.Parse(userIdString);
            var hospital = _dbContext.Hospitals.FirstOrDefault(h => h.UserId == userId);
            if (hospital == null)
            { return BadRequest(); }
            if(!hospital.IsVerified)
            {
                return BadRequest(new { message = "Hospital is not verified yet" });
            }
            var bloodRequest = new BloodRequests
            {

                BloodType= dto.BloodType,
                Quantity = (long)dto.Quantity,
                Urgency = dto.Urgency,
                Status = "Pending",
                CreatedAt = DateTime.UtcNow,
                HospitalId = hospital.Id
            };
            _dbContext.BloodRequests.Add(bloodRequest);
            await _dbContext.SaveChangesAsync();
            return Ok(new { message = "Blood request created successfully" });

        }
        [HttpGet("bloodrequests")]
        [Authorize(Roles = "Donor")]
        public async Task<IActionResult> bloodrequests()
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var userId = int.Parse(userIdString);
            var donor = await _dbContext.Donors.FirstOrDefaultAsync(d => d.UserId == userId);
            if (donor == null) return NotFound();
            var requests = from r in _dbContext.BloodRequests
                           join h in _dbContext.Hospitals on r.HospitalId equals h.Id
                           join u in _dbContext.Users on h.UserId equals u.Id
                           where r.Status == "Pending" && h.IsVerified && donor.BloodType == r.BloodType
                           select new
                           {
                               r.Id,
                               r.BloodType,
                               r.Quantity,
                               r.Urgency,
                               r.CreatedAt,
                               HospitalName = h.HospitalName,
                               HospitalCity = h.City,
                               HospitalAddress = h.Address,
                               ContactEmail = u.Email,
                               ContactPhone = u.Phone
                           };
            return Ok(await requests.ToListAsync());
        }
    }
}
