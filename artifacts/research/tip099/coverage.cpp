#include <algorithm>
#include <array>
#include <chrono>
#include <fstream>
#include <iostream>
#include <map>
#include <numeric>
#include <sstream>
#include <stdexcept>
#include <string>
#include <vector>
#include <sys/resource.h>
using I=__int128_t;
using P=std::array<I,5>;
I add(I a,I b){I c;if(__builtin_add_overflow(a,b,&c))throw std::runtime_error("INT128_OVERFLOW");return c;}
I mul(I a,I b){I c;if(__builtin_mul_overflow(a,b,&c))throw std::runtime_error("INT128_OVERFLOW");return c;}
I neg(I a){return mul(a,-1);}
I ab(I a){return a<0?neg(a):a;}
I gcdI(I a,I b){a=ab(a);b=ab(b);while(b){I c=a%b;a=b;b=c;}return a;}
std::string str(I a){if(a==0)return "0";bool minus=a<0;a=ab(a);std::string s;while(a){s.push_back('0'+a%10);a/=10;}if(minus)s.push_back('-');std::reverse(s.begin(),s.end());return s;}
P normalize(P v){I g=0;for(I x:v)g=gcdI(g,x);if(!g||!v[4])throw std::runtime_error("BAD_HOMOGENEOUS_VERTEX");for(I &x:v)x/=g;if(v[4]<0)for(I &x:v)x=neg(x);return v;}
I eval(P p,P v){I s=0;for(int j=0;j<4;j++)s=add(s,mul(p[j],v[j]));return add(s,mul(p[4],v[4]));}
int sign(I x){return (x>0)-(x<0);}
I det(const std::vector<std::vector<I>>&m){int n=m.size();if(n==0)return 1;if(n==1)return m[0][0];I result=0;for(int j=0;j<n;j++){std::vector<std::vector<I>> sub;for(int i=1;i<n;i++){std::vector<I> row;for(int k=0;k<n;k++)if(k!=j)row.push_back(m[i][k]);sub.push_back(row);}I term=mul(m[0][j],det(sub));result=add(result,j%2?neg(term):term);}return result;}
bool independent(const std::vector<int>&ids,const std::vector<P>&planes){int k=ids.size();for(int mask=0;mask<16;mask++)if(__builtin_popcount((unsigned)mask)==k){std::vector<std::vector<I>> m;for(int id:ids){std::vector<I> row;for(int c=0;c<4;c++)if(mask&(1<<c))row.push_back(planes[id][c]);m.push_back(row);}if(det(m))return true;}return false;}
struct V{P h;std::array<unsigned long long,2> active{};};
struct C{std::vector<int> v;std::string signs;int graph=-1;I bound_num=0,bound_den=1;};
struct Engine{
 std::vector<P> planes;std::vector<V> vertices;std::map<P,int> index;
 std::vector<std::pair<I,I>> bounds;
 std::chrono::steady_clock::time_point start=std::chrono::steady_clock::now();double seconds;size_t cap;long peak=0;
 double elapsed(){return std::chrono::duration<double>(std::chrono::steady_clock::now()-start).count();}
 void guard(){if(elapsed()>seconds)throw std::runtime_error("TIME_LIMIT");struct rusage r;getrusage(RUSAGE_SELF,&r);peak=std::max(peak,r.ru_maxrss);
#ifdef __APPLE__
 if(peak>1536L*1024*1024)throw std::runtime_error("RSS_LIMIT");
#else
 if(peak>1536L*1024)throw std::runtime_error("RSS_LIMIT");
#endif
 }
 int vertex(P h){h=normalize(h);auto found=index.find(h);if(found!=index.end())return found->second;V v;v.h=h;for(size_t i=0;i<planes.size();i++)if(eval(planes[i],h)==0)v.active[i/64]|=1ULL<<(i%64);int id=vertices.size();vertices.push_back(v);index[h]=id;return id;}
 bool retire(C &c){if(bounds.empty())return false;int mask=0,bit=0;for(int j=0;j<5;j++)for(int k=j+1;k<5;k++,bit++){bool above=true,below=true;for(int id:c.v){const P&h=vertices[id].h;I difference=add(k<4?h[k]:0,neg(h[j]));I scaled=mul(5,difference);above&=scaled>=h[4];below&=scaled<=mul(-(k-j),h[4]);}if(!above&&!below)mask|=1<<bit;}auto bound=bounds[mask];if(mul(61,bound.first)>=mul(14,bound.second)){c.graph=mask;c.bound_num=bound.first;c.bound_den=bound.second;return true;}return false;}
 std::vector<int> shared(int a,int b,int prefix){std::vector<int> ids;for(int i=0;i<prefix;i++)if((vertices[a].active[i/64]&vertices[b].active[i/64])&(1ULL<<(i%64))){auto trial=ids;trial.push_back(i);if(independent(trial,planes))ids=trial;if(ids.size()==3)return ids;}return {};}
 int crossing(int a,int b,int wall,const std::vector<int>&basis){std::vector<std::vector<I>> m;std::vector<I> rhs;for(int id:basis){m.emplace_back(planes[id].begin(),planes[id].begin()+4);rhs.push_back(neg(planes[id][4]));}m.emplace_back(planes[wall].begin(),planes[wall].begin()+4);rhs.push_back(neg(planes[wall][4]));P h;h[4]=det(m);if(!h[4])throw std::runtime_error("EDGE_INTERSECTION_SINGULAR");for(int j=0;j<4;j++){auto altered=m;for(int i=0;i<4;i++)altered[i][j]=rhs[i];h[j]=det(altered);}h=normalize(h);
 // Certify the Cramer point lies strictly inside the crossed segment.
 int coordinate=0;while(coordinate<4&&mul(vertices[a].h[coordinate],vertices[b].h[4])==mul(vertices[b].h[coordinate],vertices[a].h[4]))coordinate++;
 if(coordinate==4)throw std::runtime_error("DUPLICATE_EDGE_ENDPOINTS");
 I ha=add(mul(h[coordinate],vertices[a].h[4]),neg(mul(vertices[a].h[coordinate],h[4])));
 I hb=add(mul(h[coordinate],vertices[b].h[4]),neg(mul(vertices[b].h[coordinate],h[4])));
 if(sign(ha)*sign(hb)!=-1)throw std::runtime_error("INTERSECTION_OUTSIDE_EDGE");return vertex(h);}
 std::vector<C> split(const C&c,int wall){std::vector<int> sv;bool pos=false,minus=false;for(int id:c.v){int s=sign(eval(planes[wall],vertices[id].h));sv.push_back(s);pos|=s>0;minus|=s<0;}if(!pos&&!minus)throw std::runtime_error("NON_FULL_DIMENSIONAL_CELL");if(!pos||!minus){C out=c;out.signs.push_back(pos?'+':'-');return {out};}
 C lo,hi;lo.signs=c.signs+'-';hi.signs=c.signs+'+';for(size_t i=0;i<c.v.size();i++){if(sv[i]<=0)lo.v.push_back(c.v[i]);if(sv[i]>=0)hi.v.push_back(c.v[i]);}
 for(size_t i=0;i<c.v.size();i++)for(size_t j=0;j<i;j++)if(sv[i]*sv[j]==-1){guard();auto basis=shared(c.v[i],c.v[j],wall);if(basis.size()==3){int id=crossing(c.v[i],c.v[j],wall,basis);for(int k=0;k<wall;k++){int s=sign(eval(planes[k],vertices[id].h));int expected=k<8?-1:(c.signs[k-8]=='+'?1:-1);if(s&&s!=expected)throw std::runtime_error("NEW_VERTEX_OUTSIDE_PARENT");}lo.v.push_back(id);hi.v.push_back(id);}}
 for(C*out:{&lo,&hi}){std::sort(out->v.begin(),out->v.end());out->v.erase(std::unique(out->v.begin(),out->v.end()),out->v.end());if(out->v.size()<5)throw std::runtime_error("BAD_SPLIT_VERTEX_COUNT");}return {lo,hi};}
};
int main(int argc,char**argv){std::string input,output,prunetable;int maxplanes=78;size_t cap=50000;double seconds=60;for(int i=1;i<argc;i++){std::string a=argv[i];if(i+1==argc){std::cerr<<"missing flag value\n";return 2;}std::string v=argv[++i];if(a=="--walls")input=v;else if(a=="--out")output=v;else if(a=="--prune-table")prunetable=v;else if(a=="--max-planes")maxplanes=std::stoi(v);else if(a=="--cell-cap")cap=std::stoull(v);else if(a=="--seconds")seconds=std::stod(v);else return 2;}
 if(input.empty()||output.empty()||maxplanes<0||cap<1||cap>50000||!(seconds>0&&seconds<=180))return 2;
 Engine e;e.seconds=seconds;e.cap=cap;std::vector<C> cells,retired;int processed=0;std::string reason="ALL_PLANES_PROCESSED";bool complete=false;
 try{for(int j=0;j<4;j++)for(int s:{-1,1}){P p{};p[j]=s;p[4]=-3;e.planes.push_back(p);}std::ifstream in(input);long long x;while(in>>x){P p{};p[0]=x;for(int j=1;j<5;j++){long long z;if(!(in>>z))throw std::runtime_error("BAD_WALL_FILE");p[j]=z;}for(I z:p)if(ab(z)>1000000)throw std::runtime_error("NORMAL_COEFFICIENT_LIMIT");if(std::all_of(p.begin(),p.begin()+4,[](I z){return z==0;}))throw std::runtime_error("CONSTANT_WALL");e.planes.push_back(p);}if(e.planes.size()>128||!in.eof())throw std::runtime_error("BAD_WALL_FILE");C cube;for(int mask=0;mask<16;mask++){P v{};v[4]=1;for(int j=0;j<4;j++)v[j]=mask&(1<<j)?3:-3;cube.v.push_back(e.vertex(v));}cells.push_back(cube);
 if(!prunetable.empty()){if(e.planes.size()!=86)throw std::runtime_error("PRUNE_TABLE_ONLY_N5_78_WALLS");std::ifstream table(prunetable);long long num,den;while(table>>num>>den){if(num<0||den<=0)throw std::runtime_error("BAD_PRUNE_TABLE");e.bounds.push_back({num,den});}if(e.bounds.size()!=1024||!table.eof())throw std::runtime_error("BAD_PRUNE_TABLE");}
 for(int wall=8;wall<(int)e.planes.size();wall++){if(cells.empty()){reason="ALL_ACTIVE_CELLS_RETIRED";break;}if(processed==maxplanes){reason="MAX_PLANES_LIMIT";break;}std::vector<C> next,pending_retired;for(const C&old:cells){e.guard();C c=old;if(e.retire(c)){pending_retired.push_back(std::move(c));}else{auto parts=e.split(c,wall);for(auto &part:parts)next.push_back(std::move(part));}if(retired.size()+pending_retired.size()+next.size()>cap)throw std::runtime_error("CELL_LIMIT");}cells=std::move(next);for(auto &c:pending_retired)retired.push_back(std::move(c));processed++;std::cerr<<"planes="<<processed<<" active="<<cells.size()<<" retired="<<retired.size()<<" vertices="<<e.vertices.size()<<" seconds="<<e.elapsed()<<"\n";}
 complete=processed==(int)e.planes.size()-8||(!retired.empty()&&cells.empty());
 }catch(const std::exception&ex){reason=ex.what();}
 std::ostringstream out;out<<"{\"status\":\""<<(complete?"COMPLETE_COVER":"PARTIAL_COVER")<<"\",\"reason\":\""<<reason<<"\",\"processed_planes\":"<<processed<<",\"pending_planes\":"<<(e.planes.size()>=8?e.planes.size()-8-processed:0)<<",\"cell_count\":"<<cells.size()+retired.size()<<",\"active_cell_count\":"<<cells.size()<<",\"retired_cell_count\":"<<retired.size()<<",\"elapsed_seconds\":"<<e.elapsed()<<",\"peak_rss_native_units\":"<<e.peak<<",\"guards\":{\"max_planes\":"<<maxplanes<<",\"cell_cap\":"<<cap<<",\"max_seconds\":"<<seconds<<",\"rss_bytes\":1610612736,\"artifact_bytes\":67108864,\"coefficient_limit\":1000000,\"arithmetic\":\"CHECKED_INT128\"},\"planes\":[";
 for(size_t i=0;i<e.planes.size();i++){if(i)out<<',';out<<'[';for(int j=0;j<5;j++){if(j)out<<',';out<<'"'<<str(e.planes[i][j])<<'"';}out<<']';}out<<"],\"vertices\":[";
 for(size_t i=0;i<e.vertices.size();i++){if(i)out<<',';out<<"{\"h\":[";for(int j=0;j<5;j++){if(j)out<<',';out<<'"'<<str(e.vertices[i].h[j])<<'"';}out<<"],\"active\":[";bool first=true;for(size_t j=0;j<e.planes.size();j++)if(e.vertices[i].active[j/64]&(1ULL<<(j%64))){if(!first)out<<',';first=false;out<<j;}out<<"]}";}out<<"],\"cells\":[";
 for(size_t i=0;i<cells.size();i++){if(i)out<<',';out<<"{\"signs\":\""<<cells[i].signs<<"\",\"vertices\":[";for(size_t j=0;j<cells[i].v.size();j++){if(j)out<<',';out<<cells[i].v[j];}out<<"]}";}out<<"],\"retired_cells\":[";
 for(size_t i=0;i<retired.size();i++){const C&c=retired[i];if(i)out<<',';out<<"{\"signs\":\""<<c.signs<<"\",\"graph_mask\":"<<c.graph<<",\"bound_num\":\""<<str(c.bound_num)<<"\",\"bound_den\":\""<<str(c.bound_den)<<"\",\"vertices\":[";for(size_t j=0;j<c.v.size();j++){if(j)out<<',';out<<c.v[j];}out<<"]}";}out<<"]}";std::string data=out.str();if(data.size()>67108864){data="{\"status\":\"PARTIAL_COVER\",\"reason\":\"ARTIFACT_LIMIT\",\"geometry_omitted\":true,\"processed_planes\":"+std::to_string(processed)+",\"cell_count\":"+std::to_string(cells.size()+retired.size())+"}";complete=false;}std::ofstream file(output);file<<data<<'\n';if(!file)return 2;std::cout<<"status="<<(complete?"COMPLETE_COVER":"PARTIAL_COVER")<<" reason="<<reason<<" planes="<<processed<<" active="<<cells.size()<<" retired="<<retired.size()<<" bytes="<<data.size()<<"\n";return complete?0:3;
}
